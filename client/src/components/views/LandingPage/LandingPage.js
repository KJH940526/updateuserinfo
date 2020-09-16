import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../../../_actions/user_action";

function LandingWrapper (props){
  const userData = useSelector(state => state.user.userData)
  console.log("이게 렌딩페이지 감싼다",userData);
  return (// 컴포넌트 랩핑이란?  https://www.google.com/search?q=%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8+wrapping&oq=%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8+wrapping&aqs=chrome..69i57.4608j0j1&sourceid=chrome&ie=UTF-8
  <> {/* 객체는 얕은비교를 수행한다?? 공부하기*/}
      {/*LandingWrapper로 감싸주는 이유는 userData를 불러보기 전에 페이지가 랜더링 
      되기 떄문에 언디파인드가 뜨기 때문에 감싸서 조건을 걸어준다.*/}
    {userData !==undefined  &&<LandingPage userData={userData} props={props}></LandingPage>}
  </>
  );
}


                      //props와 userData를 감싸서 보내줬다.
function LandingPage({props, userData}) {
  let dispatch = useDispatch();

  console.log("랜딩페이지유저 데이터",userData);
  
  const onClickHandler = (event) => {
    console.log("이벤트",event)
        dispatch(logoutUser())
        .then(response => {
          console.log("로그아웃 response.payload", response.payload);
          if(response.payload.success){
            alert("로그아웃에 성공했습니다.");
            props.history.push('/')
          } else {
            alert("로그아웃 하는데 실패 했습니다.");
          }
        })
  };

  const onLogin = (event) => {
    console.log("이벤트",event)
    console.log(props)
    props.history.push("/login");
  };

  const onRegister = (event) => {
    console.log("이벤트",event)
    console.log(props)
    props.history.push("/register");
  };

  const onMyPage = (event) => {
    console.log("이벤트",event)
    console.log(props)
    props.history.push("/mypage");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <span>
        <h2>LandingPage</h2>
        <div>{!userData.isAuth ? <button onClick={onRegister}>회원가입</button>: false}</div>
        <div>{!userData.isAuth ? <button onClick={onLogin}>로그인</button>: false}</div>
        <div>{userData.isAuth ? <button onClick={onClickHandler}> 로그아웃 </button>: false}</div>
        <div>{userData.isAuth&&!userData.isSns ? <button onClick={onMyPage}> 회원수정 </button>: false}</div>
      </span>
    </div>
  );
}
                //위의 감싸준것에 따라서 달라지기 때문에 LandingWrapper를 보내주는게 맞다.
export default withRouter(LandingWrapper);