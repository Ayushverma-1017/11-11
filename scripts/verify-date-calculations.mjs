import assert from 'node:assert/strict'
import { calculateTimeParts, isPastTargetDate } from '../src/utils/dateMath.ts'
import { birthdayContent, validateBirthdayContent } from '../src/data/birthdayContent.ts'

const second = 1000
const day = 86_400 * second
const start = Date.parse('2026-09-04T00:00:00+05:30')
const elapsedNow = start + 2 * day + 3 * 3_600 * second + 4 * 60 * second + 5 * second + 999
assert.deepEqual(calculateTimeParts(start, elapsedNow, 'elapsed'), { days: 2, hours: 3, minutes: 4, seconds: 5 })
assert.deepEqual(calculateTimeParts(start, start - second, 'elapsed'), { days: 0, hours: 0, minutes: 0, seconds: 0 })

const birthday = Date.parse(birthdayContent.birthdayDate)
assert.deepEqual(calculateTimeParts(birthday, birthday - day - 2 * 3_600 * second, 'remaining'), { days: 1, hours: 2, minutes: 0, seconds: 0 })
assert.deepEqual(calculateTimeParts(birthday, birthday + second, 'remaining'), { days: 0, hours: 0, minutes: 0, seconds: 0 })
const meeting = Date.parse(birthdayContent.firstMeetingDate)
assert.equal(isPastTargetDate(meeting, meeting), false, 'the midnight boundary is still the hoped-for date')
assert.equal(isPastTargetDate(meeting, meeting + day - second), false, 'the day-of message remains through the final second')
assert.equal(isPastTargetDate(meeting, meeting + day), true, 'the editable future-facing message starts after the planned IST date')

assert.equal(new Date(start).toISOString(), '2026-09-03T18:30:00.000Z', 'midnight IST should resolve to the correct UTC instant')
assert.deepEqual(validateBirthdayContent(birthdayContent), [], 'starter content should pass validation')
for (const date of [birthdayContent.conversationStartDate, birthdayContent.birthdayDate, birthdayContent.firstMeetingDate]) {
  assert.ok(date.endsWith('+05:30'), 'configured dates should state the IST offset')
}

console.log('Date verification passed: IST instant parsing, elapsed time, countdown, zero clamping, and content validation.')
