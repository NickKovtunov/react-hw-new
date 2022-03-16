import './App.css';
import {connect} from 'react-redux';

function App(props:any) {

  function findReviewer() {
    if (props.login && props.repo) {
      props.fetchData(props.login, props.repo, onSuccess);
    } else{
      alert("Не заполнены необходимые поля ()")
    }
  }

  const onSuccess = (data: any) => {
    let c = ""
    data.forEach(function(item:any) {
      c = c + ' ' + item.login
    });
    props.onChangeContributors(c)
    if (!data && data.length > 0) {
      props.onChangeReviewer(null);
      return;
    }
    const filtered = data
      .filter((item:any) => !props.blackList
        .split(',').map((blackItem:any) => blackItem.trim())
        .includes(item.login)
      )
    if (filtered && filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      props.onChangeReviewer(filtered[randomIndex]);
    } else {
      props.onChangeReviewer(null);
    }

    localStorage.setItem('login', JSON.stringify(props.login));
    localStorage.setItem('repo', JSON.stringify(props.repo));
    localStorage.setItem('blackList', JSON.stringify(props.blackList));

    return data
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React. Найти ревьюера</h1>

        <h3>Настройки</h3>
        <input className='custom_input'
                placeholder='login' 
                name="login" 
                value={props.login}
                onChange={(e) => props.onChangeLogin(e.target.value)}/>

        <input className='custom_input'
                placeholder='repo' 
                name="repo" 
                value={props.repo} 
                onChange={(e) => props.onChangeRepo(e.target.value)}/>

        <input className='custom_input'
                placeholder='blackList' 
                name="blackList" 
                value={props.blackList} 
                onChange={(e) => props.onChangeBlackList(e.target.value)}/>

        <button className="btn" onClick={findReviewer}>Найти проверяющего</button>
        
        <h3>Результаты поиска</h3>
        {props.reviewer &&
          <div>
            <img height="200px" src={props.reviewer.avatar_url} alt="" />
            <div>{props.reviewer.login}</div>
          </div>
        }

        <h3>Контрибьютеры репозитория</h3>
        <p className='contributors'>{props.contributors}</p>
      </header>
    </div>
  );
}

function mapStateToProps (state: any) {
  return {
    login: state.login,
    repo: state.repo,
    blackList: state.blackList,
    reviewer: state.reviewer,
    contributors: state.contributors,
  }
}

function mapDispatchToProps(dispatch: any){
  return{
    onChangeLogin: (login:any) => dispatch({type: 'ChangeLogin', payload: login}),
    onChangeRepo: (repo:any) => dispatch({type: 'ChangeRepo', payload: repo}),
    onChangeBlackList: (blackList:any) => dispatch({type: 'ChangeBlackList', payload: blackList}),
    onChangeReviewer: (reviewer:any) => dispatch({type: 'ChangeReviewer', payload: reviewer}),
    onChangeContributors: (contributors:any) => dispatch({type: 'ChangeContributors', payload: contributors}),
    fetchData: (login: string, repo: string, onSuccess: any) => dispatch({
      type: 'FetchData',
      meta: {
        type: 'api',
        url: `https://api.github.com/repos/${login}/${repo}/contributors`,
        onSuccess
      }})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);