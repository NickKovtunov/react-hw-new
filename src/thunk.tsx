export default (dispatch:any) => (next:any) => (action:any) => {
  if (!action.meta || action.meta.type !== 'api') {
    return next(action);
  }

  const {url, onSuccess} = action.meta;

  fetch(url)
  .then((response) => response.json())
  .then(json => onSuccess(json))
}