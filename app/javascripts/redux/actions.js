import { ADD_TOKEN, UPDATE_TOKEN, SUBMISSION_ACCEPTED, BOUNTY_ACTIVATED, JOB_SUBMITTED } from '@/config/constants'

export function addTokenAction(tokenObject) {
  return { type: ADD_TOKEN, token: tokenObject }
}

export function updateTokenAction(tokenObject) {
  return { type: UPDATE_TOKEN, token: tokenObject }
}

export function bountyActivatedAction(result) {
  return { type: BOUNTY_ACTIVATED }
}

export function submissionAcceptedAction(result) {
  return { type: SUBMISSION_ACCEPTED }
}

export function jobSubmittedAction(result) {
  return { type: JOB_SUBMITTED }
}
