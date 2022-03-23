import { Dispatch, AnyAction } from "redux";

export default (dispatch:any) => (next:Dispatch<AnyAction>) => (action: AnyAction) => {
  if (!action.meta || action.meta.type !== 'api') {
    return next(action);
  }

  const {url, onSuccess} = action.meta;

  fetch(url)
  .then((response) => response.json())
  .then(json => onSuccess(json))
}