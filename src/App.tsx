import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, useRef } from 'react';
import { AnyAction } from 'redux';

function App() 
{
  const loginRef = useRef<HTMLInputElement>(null);
  const repoRef = useRef<HTMLInputElement>(null);
  const blackListRef = useRef<HTMLInputElement>(null);
  const localProps = {login: "", repo: "", blackList: ""};
  const props = useSelector((state) => state.rd);
  const dispatch = useDispatch();

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
      dispatch({
        type: 'FetchData',
        meta: {
          type: 'api',
          url: `https://api.github.com/repos/${localProps.login}/${localProps.repo}/contributors`,
          onSuccess
        }})
    } else{
      alert("Не заполнены необходимые поля")
    }
  }

  const onSuccess = (data: any ) => {
    let c = ""
    data.forEach(function(item:{login:string}) {
      c = c + ' ' + item.login
    });
    dispatch({type: 'ChangeContributors', payload: c})
    if (!data && data.length > 0) {
      dispatch({type: 'ChangeReviewer', payload: undefined});
      return;
    }
    const filtered = data
      .filter((item:{login:string}) => !localProps.blackList
        .split(',').map((blackItem:string) => blackItem.trim())
        .includes(item.login)
      )
    if (filtered && filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      dispatch({type: 'ChangeReviewer', payload: filtered[randomIndex]})
    } else {
      dispatch({type: 'ChangeReviewer', payload: undefined})
    }

    localStorage.setItem('login', JSON.stringify(localProps.login));
    localStorage.setItem('repo', JSON.stringify(localProps.repo));
    localStorage.setItem('blackList', JSON.stringify(localProps.blackList));
    dispatch({type: 'ChangeLogin', payload: localProps.login});
    dispatch({type: 'ChangeRepo', payload: localProps.repo});
    dispatch({type: 'ChangeBlackList', payload: localProps.blackList});

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

export default App;