import { ADD_TOKEN, UPDATE_TOKEN, SUBMISSION_ACCEPTED, BOUNTY_ACTIVATED, JOB_SUBMITTED } from '@/config/constants'

const initialTokenState = {
  tokens: []
}

const initialSubmissionState = {
  submissions: []
}

export function submissions(state = [], action) {
  switch (action.type) {
    case SUBMISSION_ACCEPTED:
      return [
        ...state,
        action.submission
      ]

    case JOB_SUBMITTED:
      return [
        ...state,
        action.submission
      ]

    default:
      return state
  }
}

export function tokens(state = [], action) {
  switch (action.type) {
    case ADD_TOKEN:
      return [
        ...state,
        action.token
      ]

    case UPDATE_TOKEN:
      // A more performant way to do this as the array grows in size is to use a hash/dict:
      // https://redux.js.org/recipes/structuring-reducers
      let newTokens = state.map( (token) => {
        // This isn't the token we care about - keep it as-is
        if (token.transactionHash !== action.token.transactionHash) return token;

        // // This is the one we want - return an updated value
        return {
          ...token,
          ...action.token
        };
      });

      return newTokens
    default:
      return state
  }
}
