/**
 * Redis data store for caching information from the Slack API.
 */

import SlackDataStore from '@slack/client/lib/data-store/data-store'
import { forEach } from 'lodash'
import models from '@slack/client/lib/models'
import bluebird from 'bluebird'
import redis from 'redis'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

class SlackRedisDataStore extends SlackDataStore {

  constructor(opts) {
    const dataStoreOpts = opts || {}
    super(dataStoreOpts)
    this.keyPrefix = dataStoreOpts.keyPrefix || ''
    this.userKeyName = this.fullKeyName(dataStoreOpts.userKeyName || 'user')
    this.userByNameKeyName = this.fullKeyName(dataStoreOpts.userByNameKeyName || 'user.name')
    this.userByEmailKeyName = this.fullKeyName(dataStoreOpts.userByEmailKeyName || 'user.email')
    this.userByBotIdKeyName = this.fullKeyName(dataStoreOpts.userByBotIdKeyName || 'user.botId')
    this.channelKeyName = this.fullKeyName(dataStoreOpts.channelKeyName || 'channel')
    this.channelByNameKeyName = this.fullKeyName(dataStoreOpts.channelByNameKeyName || 'channel.name')
    this.dmKeyName = this.fullKeyName(dataStoreOpts.dmKeyName || 'dm')
    this.dmByUserIdKeyName = this.fullKeyName(dataStoreOpts.dmByUserIdKeyName || 'dm.userId')
    this.groupKeyName = this.fullKeyName(dataStoreOpts.groupKeyName || 'group')
    this.groupByNameKeyName = this.fullKeyName(dataStoreOpts.groupByNameKeyName || 'group.name')
    this.botKeyName = this.fullKeyName(dataStoreOpts.botKeyName || 'bot')
    this.botByNameKeyName = this.fullKeyName(dataStoreOpts.botByNameKeyName || 'bot.name')
    this.teamKeyName = this.fullKeyName(dataStoreOpts.teamKeyName || 'team')
    this.client = redis.createClient(dataStoreOpts.redisOpts || {})
  }

  fullKeyName(name) {
    return `${this.keyPrefix}${name}`
  }

  serialize(obj) {
    return JSON.stringify(obj)
  }

  deserialize(data) {
    return JSON.parse(data)
  }

  clear() {
    return this.client.multi()
      .del(this.userKeyName)
      .del(this.userByNameKeyName)
      .del(this.userByEmailKeyName)
      .del(this.userByBotIdKeyName)
      .del(this.channelKeyName)
      .del(this.channelByNameKeyName)
      .del(this.dmKeyName)
      .del(this.dmByUserIdKeyName)
      .del(this.groupKeyName)
      .del(this.groupByNameKeyName)
      .del(this.botKeyName)
      .del(this.botByNameKeyName)
      .del(this.teamKeyName)
      .execAsync()
  }

  deserializeToModel(Model, data) {
    return new Model(this.deserialize(data))
  }

  getUserById = async (userId) => {
    if (!userId) {
      return undefined
    }

    let user
    const data = await this.client.hgetAsync(this.userKeyName, userId)
    if (data) {
      user = this.deserializeToModel(models.User, data)
    }
    return user
  }

  getUserByName = async (name) => {
    const userId = await this.client.hgetAsync(this.userByNameKeyName, name)
    return this.getUserById(userId)
  }

  getUserByEmail = async (email) => {
    const userId = await this.client.hgetAsync(this.userByEmailKeyName, email)
    return this.getUserById(userId)
  }

  getUserByBotId = async (botId) => {
    const userId = await this.client.hgetAsync(this.userByBotIdKeyName, botId)
    return this.getUserById(userId)
  }

  getChannelById = async (channelId) => {
    if (!channelId) {
      return undefined
    }

    let channel
    const data = await this.client.hgetAsync(this.channelKeyName, channelId)
    if (data) {
      channel = this.deserializeToModel(models.Channel, data)
    }
    return channel
  }

  getChannelByName = async (name) => {
    const transformedName = name.replace(/^#/, '')
    const channelId = await this.client.hgetAsync(this.channelByNameKeyName, transformedName)
    return this.getChannelById(channelId)
  }

  getGroupById = async (groupId) => {
    if (!groupId) {
      return undefined
    }

    let group
    const data = await this.client.hgetAsync(this.groupKeyName, groupId)
    if (data) {
      group = this.deserializeToModel(models.Group, data)
    }
    return group
  }

  getGroupByName = async (name) => {
    const groupId = await this.client.hgetAsync(this.groupByNameKeyName, name)
    return this.getGroupById(groupId)
  }

  getDMById = async (dmId) => {
    if (!dmId) {
      return undefined
    }

    let dm
    const data = await this.client.hgetAsync(this.dmKeyName, dmId)
    if (data) {
      dm = this.deserializeToModel(models.DM, data)
    }
    return dm
  }

  getDMByUserId = async (userId) => {
    const dmId = await this.client.hgetAsync(this.dmByUserIdKeyName, userId)
    return this.getDMById(dmId)
  }

  getDMByName = async (name) => {
    const userId = await this.client.hgetAsync(this.userByNameKeyName, name)
    return this.getDMByUserId(userId)
  }

  getBotById = async (botId) => {
    if (!botId) {
      return undefined
    }

    let bot
    const data = await this.client.hgetAsync(this.botKeyName, botId)
    if (data) {
      bot = this.deserialize(data)
    }
    return bot
  }

  getBotByName = async (name) => {
    const botId = await this.client.hgetAsync(this.botByNameKeyName, name)
    return this.getBotById(botId)
  }

  getBotByUserId = async (userId) => {
    let bot
    const user = await this.getUserById(userId)
    if (user) {
      bot = this.getBotById(user.profile.bot_id)
    }
    return bot
  }

  getTeamById = async (teamId) => {
    if (!teamId) {
      return undefined
    }

    let team
    const data = await this.client.hgetAsync(this.teamKeyName, teamId)
    if (data) {
      team = this.deserialize(data)
    }
    return team
  }

  setChannel(channel, multi = this.client.multi()) {
    return multi
      .hset(this.channelKeyName, channel.id, this.serialize(channel))
      .hset(this.channelByNameKeyName, channel.name, channel.id)
      .execAsync()
  }

  setGroup(group, multi = this.client.multi()) {
    return multi
      .hset(this.groupKeyName, group.id, this.serialize(group))
      .hset(this.groupByNameKeyName, group.name, group.id)
      .execAsync()
  }

  setDM(dm, multi = this.client.multi()) {
    return multi
      .hset(this.dmKeyName, dm.id, this.serialize(dm))
      .hset(this.dmByUserIdKeyName, dm.user, dm.id)
      .execAsync()
  }

  setUser(user, m = this.client.multi()) {
    let multi = m
      .hset(this.userKeyName, user.id, this.serialize(user))
      .hset(this.userByNameKeyName, user.name, user.id)

    if (user.profile.bot_id) {
      multi = multi.hset(this.userByBotIdKeyName, user.profile.bot_id, user.id)
    }
    if (user.profile.email) {
      multi = multi.hset(this.userByEmailKeyName, user.profile.email, user.id)
    }
    return multi.execAsync()
  }

  setBot(bot, multi = this.client.multi()) {
    return multi
      .hset(this.botKeyName, bot.id, this.serialize(bot))
      .hset(this.botByNameKeyName, bot.name, bot.id)
      .execAsync()
  }

  setTeam(team, multi = this.client.multi()) {
    return multi
      .hset(this.teamKeyName, team.id, this.serialize(team))
      .execAsync()
  }

  upsertChannel = async (channel) => {
    let multi
    let instance
    const prev = await this.getChannelById(channel.id)
    if (prev) {
      multi = this.client.multi()
        .hdel(this.channelByNameKeyName, prev.name)
      instance = prev.update(channel)
    } else {
      instance = new models.Channel(channel)
    }
    return this.setChannel(instance, multi)
  }

  upsertGroup = async (group) => {
    let multi
    let instance
    const prev = await this.getGroupById(group.id)
    if (prev) {
      multi = this.client.multi()
        .hdel(this.groupByNameKeyName, prev.name)
      instance = prev.update(group)
    } else {
      instance = new models.Group(group)
    }
    return this.setGroup(instance, multi)
  }

  upsertDM = async (dm) => {
    let multi
    let instance
    const prev = await this.getDMById(dm.id)
    if (prev) {
      multi = this.client.multi()
        .hdel(this.dmByUserIdKeyName, prev.user)
      instance = prev.update(dm)
    } else {
      instance = new models.DM(dm)
    }
    return this.setDM(instance, multi)
  }

  upsertUser = async (user) => {
    let multi
    let instance
    const prev = await this.getUserById(user.id)
    if (prev) {
      multi = this.client.multi()
        .hdel(this.userByNameKeyName, prev.name)
        .hdel(this.userByEmailKeyName, prev.email)

      if (prev.profile && prev.profile.bot_id) {
        multi = multi.hdel(this.userByBotIdKeyName, prev.profile.bot_id)
      }

      instance = prev.update(user)
    } else {
      instance = new models.User(user)
    }
    return this.setUser(instance, multi)
  }

  upsertBot = async (bot) => {
    let multi
    let instance
    const prev = await this.getBotById(bot.id)
    if (prev) {
      multi = this.client.multi()
        .hdel(this.botByNameKeyName, prev.name)
      instance = Object.assign({}, prev, bot)
    } else {
      instance = bot
    }
    return this.setBot(instance, multi)
  }

  upsertTeam = async (team) => {
    let instance
    const prev = await this.getTeamById(team.id)
    if (prev) {
      instance = Object.assign({}, prev, team)
    } else {
      instance = team
    }
    return this.setTeam(instance)
  }

  removeChannel = async (channelId) => {
    const channel = await this.getChannelById(channelId)
    return this.client.multi()
      .hdel(this.channelByNameKeyName, channel.name)
      .hdel(this.channelKeyName, channel.id)
      .execAsync()
  }

  removeGroup = async (groupId) => {
    const group = await this.getGroupById(groupId)
    return this.client.multi()
      .hdel(this.groupByNameKeyName, group.name)
      .hdel(this.groupKeyName, group.id)
      .execAsync()
  }

  removeDM = async (dmId) => {
    const dm = await this.getDMById(dmId)
    return this.client().multi()
      .hdel(this.dmByUserIdKeyName, dm.user)
      .hdel(this.dmKeyName, dm.id)
      .execAsync()
  }

  removeUser = async (userId) => {
    const user = await this.getUserById(userId)
    let multi = this.cient().multi()
      .hdel(this.userByNameKeyName, user.name)
      .hdel(this.userKeyName, user.id)

    if (user.profile.bot_id) {
      multi = multi.hdel(this.userByBotIdKeyName, user.profile.bot_id)
    }
    if (user.profile.email) {
      multi = multi.hdel(this.userByEmailKeyName, user.profile.email)
    }
    return multi.execAsync()
  }

  removeBot = async (botId) => {
    const bot = await this.getBotById(botId)
    return this.client.multi()
      .hdel(this.botByNameKeyName, bot.name)
      .hdel(this.botKeyName, bot.id)
  }

  removeTeam(teamId) {
    return this.client.hdelAsync(this.teamKeyName, teamId)
  }

  cacheRtmStart = async (data) => {
    await this.clear()
    await this.cacheData(data)
    const user = await this.getUserById(data.self.id)
    user.update(data.self)
    await this.setUser(user)
  }

  cacheData = async (data) => {
    const promises = []
    forEach(data.users || [], user => {
      promises.push(this.setUser(new models.User(user)))
    })
    forEach(data.channels || [], channel => {
      promises.push(this.setChannel(new models.Channel(channel)))
    })
    forEach(data.ims || [], dm => {
      promises.push(this.setDM(new models.DM(dm)))
    })
    forEach(data.groups || [], group => {
      promises.push(this.setGroup(new models.Group(group)))
    })
    forEach(data.bots || [], bot => {
      promises.push(this.setBot(bot))
    })
    promises.push(this.setTeam(data.team))
    return Promise.all(promises)
  }

  getChannelOrGroupByName = async (name) => {
    const channel = await this.getChannelByName(name)
    return channel || this.getGroupByName(name)
  }

}

export default SlackRedisDataStore
