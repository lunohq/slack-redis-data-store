import test from 'ava'
import rtmStartFixture from '@slack/client/test/fixtures/rtm.start.json'
import { cloneDeep } from 'lodash'

import RedisDataStore from './lib'

async function getDataStore() {
  const dataStore = new RedisDataStore()
  await dataStore.cacheRtmStart(cloneDeep(rtmStartFixture))
  return dataStore
}

test.serial('#cacheRtmStart() caches the RTM start response', async t => {
  const dataStore = await getDataStore()
  const team = await dataStore.getTeamById('T0CHZBU59')
  t.is(team.name, 'slack-api-test')
  const user = await dataStore.getUserById('U0CJ5PC7L')
  t.is(user.name, 'alice')
  const channel = await dataStore.getChannelById('C0CJ25PDM')
  t.is(channel.name, 'test')
  const dm = await dataStore.getDMById('D0CHZQWNP')
  t.is(dm.latest.text, 'hi alice!')
  const group = await dataStore.getGroupById('G0CHZSXFW')
  t.is(group.name, 'private')
  const bot = await dataStore.getBotById('B0CJ5FF1P')
  t.is(bot.name, 'gdrive')
})

test.serial('#getDMByName() should get a DM with another user when passed the name of that user', async t => {
  const dataStore = await getDataStore()
  const dm = await dataStore.getDMByName('bob')
  t.is(dm.id, 'D0CHZQWNP')
})

test.serial('#getChannelByName() should get a channel by name', async t => {
  const dataStore = await getDataStore()
  const channel = await dataStore.getChannelByName('test')
  t.is(channel.name, 'test')
})

test.serial('#getChannelByName() should get a channel by #name (prefixed with #)', async t => {
  const dataStore = await getDataStore()
  const channel = await dataStore.getChannelByName('#test')
  t.is(channel.name, 'test')
})

test.serial('#getChannelByGroupOrIMById() should get a channel by id', async t => {
  const dataStore = await getDataStore()
  const channel = await dataStore.getChannelGroupOrDMById('C0CJ25PDM')
  t.truthy(channel)
})

test.serial('#getChannelByGroupOrIMById() should get a group by id', async t => {
  const dataStore = await getDataStore()
  const group = await dataStore.getChannelGroupOrDMById('G0CHZSXFW')
  t.truthy(group)
})

test.serial('#getChannelByGroupOrIMById() should get a group by id', async t => {
  const dataStore = await getDataStore()
  const dm = await dataStore.getChannelGroupOrDMById('D0CHZQWNP')
  t.truthy(dm)
})

test.serial('#getUserByEmail() should get a user by email', async t => {
  const dataStore = await getDataStore()
  const user = await dataStore.getUserByEmail('leah+slack-api-test-alice@slack-corp.com')
  t.is(user.id, 'U0CJ5PC7L')
})

test.serial('#getUserByEmail() should return undefined if no users with email is not found', async t => {
  const dataStore = await getDataStore()
  const user = await dataStore.getUserByEmail('NOT-leah+slack-api-test-alice@slack-corp.com')
  t.is(user, undefined)
})

test.serial('#getUserByName() should get a user by name', async t => {
  const dataStore = await getDataStore()
  const user = await dataStore.getUserByName('alice')
  t.is(user.id, 'U0CJ5PC7L')
})

test.serial('#getUserByName() should return undefined if no users with name is not found', async t => {
  const dataStore = await getDataStore()
  const user = await dataStore.getUserByName('NOTalice')
  t.is(user, undefined)
})
