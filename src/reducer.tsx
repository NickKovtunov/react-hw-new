const initialState = {
    login: "NewNadym",
    repo: "NewNadym.github.io",
    blackList: "NewNadym",
    reviewer: null,
    contributors: null,
    rawResult: null,
}

export default function reducer(state = initialState, action:any){
    switch(action.type){
        case 'ChangeLogin':
            return {
                ...state, login: action.payload
            }
        case 'ChangeRepo':
            return {
                ...state, repo: action.payload
            }
        case 'ChangeBlackList':
            return {
                ...state, blackList: action.payload
            }
        case 'ChangeReviewer':
            return {
                ...state, reviewer: action.payload
            }
        case 'ChangeContributors':
            return {
                ...state, contributors: action.payload
            }
        case 'FetchData': 
            return {...state, rawResult: action.payload}
        default:
            return state
    }
}