import './App.css';
import {connect} from 'react-redux';
import { Dispatch, useRef } from 'react';
import { AnyAction } from 'redux';

function App(props:{login: string, 
                    repo: string, 
                    blackList: string, 
                    reviewer: {login: string, avatar_url: string}, 
                    contributors: string,
                    onChangeContributors: (c?:string) => void,
                    onChangeReviewer: (c?:string) => void,
                    onChangeLogin: (c:string) => void,
                    onChangeRepo: (c:string) => void,
                    onChangeBlackList: (c:string) => void,
                    fetchData: (login: string, repo: string, onSuccess: any) => void
                  }) 
{
  const loginRef = useRef<HTMLInputElement>(null);
  const repoRef = useRef<HTMLInputElement>(null);
  const blackListRef = useRef<HTMLInputElement>(null);
  const localProps = {login: "", repo: "", blackList: ""}

  function findReviewer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loginRef && loginRef.current) {
      localProps.login = loginRef.current.value
    }
    if (repoRef && repoRef.current) {
      localProps.repo = repoRef.current.value
    }
    if (blackListRef && blackListRef.current) {
      localProps.blackList = blackListRef.current.value
    }
    if (localProps.login && localProps.repo) {
      props.fetchData(localProps.login, localProps.repo, onSuccess);
    } else{
      alert("Не заполнены необходимые поля")
    }
  }

  const onSuccess = (data: any ) => {
    let c = ""
    data.forEach(function(item:{login:string}) {
      c = c + ' ' + item.login
    });
    props.onChangeContributors(c)
    if (!data && data.length > 0) {
      props.onChangeReviewer(undefined);
      return;
    }
    const filtered = data
      .filter((item:{login:string}) => !localProps.blackList
        .split(',').map((blackItem:string) => blackItem.trim())
        .includes(item.login)
      )
    if (filtered && filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      props.onChangeReviewer(filtered[randomIndex]);
    } else {
      props.onChangeReviewer(undefined);
    }

    localStorage.setItem('login', JSON.stringify(localProps.login));
    localStorage.setItem('repo', JSON.stringify(localProps.repo));
    localStorage.setItem('blackList', JSON.stringify(localProps.blackList));
    props.onChangeLogin(localProps.login);
    props.onChangeRepo(localProps.repo);
    props.onChangeBlackList(localProps.blackList);

    return data
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React. Найти ревьюера</h1>

        <h3>Настройки</h3>
        <form onSubmit={findReviewer}>
          <input className='custom_input'
                  placeholder='login' 
                  name="login" 
                  ref={loginRef}/>

          <input className='custom_input'
                  placeholder='repo' 
                  name="repo" 
                  ref={repoRef}/>

          <input className='custom_input'
                  placeholder='blackList' 
                  name="blackList" 
                  ref={blackListRef}/>

          <button className="btn">Найти проверяющего</button>
        </form>
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

function mapStateToProps (state: {login: string, 
                          repo: string, 
                          blackList: string, 
                          reviewer: {login: string, avatar_url: string}, 
                          contributors: string}) {
  return {
    login: state.login,
    repo: state.repo,
    blackList: state.blackList,
    reviewer: state.reviewer,
    contributors: state.contributors,
  }
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>){
  return{
    onChangeLogin: (login:string) => dispatch({type: 'ChangeLogin', payload: login}),
    onChangeRepo: (repo:string) => dispatch({type: 'ChangeRepo', payload: repo}),
    onChangeBlackList: (blackList:string) => dispatch({type: 'ChangeBlackList', payload: blackList}),
    onChangeReviewer: (reviewer?:string) => dispatch({type: 'ChangeReviewer', payload: reviewer}),
    onChangeContributors: (contributors?:string) => dispatch({type: 'ChangeContributors', payload: contributors}),
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