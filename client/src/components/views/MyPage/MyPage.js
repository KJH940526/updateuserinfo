import React, { useState, useEffect } from "react";
import axios from 'axios'
import { withRouter} from 'react-router-dom'

import { useSelector } from "react-redux";


import DropZone from 'react-dropzone'

function MyPage(props) {
  //https://velog.io/@kim6515516/useSelector%EC%83%81%ED%83%9C%EC%A1%B0%ED%9A%8C-useDispatch%EC%95%A1%EC%85%98-%EB%94%94%EC%8A%A4%ED%8C%A8%EC%B9%98
  
  const user = useSelector(state => state.user);
  // console.log("유저",user)
  // console.log("유저 데이타",user.userData)
  //함수나 const로 정의한곳 안에서만 써야하는데 추후 자세히 알아보기,
  //처음에 user.userData가 언디파인드가 뜨는 이유??
  //리액트의 생성주기 다시한번 공부하기
  //useSelector 공부하기
  //onConfirmPasswordHandler 이부분 주석 지워보기
  //https://blog.woolta.com/categories/1/posts/200
  //https://medium.com/@shlee1353/%EB%A6%AC%EC%95%A1%ED%8A%B8-hooks-usestate-4%EA%B0%80%EC%A7%80-%EC%83%81%EC%9A%A9%EB%B0%A9%EB%B2%95-dfe8b2096750
    
  //timestamps true mongoose 알아보기

  //https://www.google.com/search?q=replace+push&oq=replace+push&aqs=chrome..69i57j0l7.5846j0j1&sourceid=chrome&ie=UTF-8
  //replace와 push의 차이

  const [updatePasswordConfirm, setUpdatePasswordConfirm] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [currentName, setCurrentName] = useState("");
  const [UpdateName, setUpdateName] = useState("");

  const [currentImage, setCurrentImage] = useState("");

  const [filePath, setFilePath] = useState("");


  useEffect(() => {
    axios.get("api/users/auth").then((response) => {
      let {name, image, password} = response.data
      console.log("MyPage라고 말해주세요", response.data);
        if(response.data.isAuth){
          console.log("마이페이지",props)
          console.log("response.data에 들어옴")

          setCurrentName(name)
          setCurrentImage(image)
          setCurrentPassword(password) //주석

          //이거 위에 주석처리해보고 아래 콘솔을 비교해보면 useeffect가 어떤 원리로 돌아가는지 느낌 잡을수 있음
          
          // console.log("useeffect 커런트네임", currentName)     //? useeffect안에서는 값이 변하지 않는다. //이거 녹음해놓음
          // console.log("useeffect 커런트이미지", currentImage)
          // console.log("useeffect 커런트 비밀번호",currentPassword)

        } else {
          alert("유저정보를 가져오는데 실패했습니다.")
          console.log("마이페이지",props)
          props.history.push("")
        }
    });
  }, []);

  // console.log("커런트네임", currentName) 
  // console.log("커런트이미지", currentImage)
  // console.log("커런트 비밀번호",currentPassword)

  



  const onNameHandler = (event) => {
    setUpdateName(event.currentTarget.value)
  }

  // const onCurrentPassword = (event) => {
  //   setCurrentPassword(event.currentTarget.value)
  // }

  const onPasswordHandler = (event) => {
    setUpdatePassword(event.currentTarget.value);
  }

  const onConfirmPasswordHandler = (event) => {
    // console.log(user.userData);
    // console.log(user.userData.isAuth)
    setUpdatePasswordConfirm(event.currentTarget.value);
  }


  const onDrop = files => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    console.log(files);
    formData.append("file", files[0]);

    axios.post("/api/image/uploadImage", formData, config)
    .then((response) => {
      if(response.data.success) {
      console.log("업로드이미지",response.data)

      setFilePath(response.data.filePath)
    }
  })
}

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(updatePassword !== updatePasswordConfirm){
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }
    // console.log("커렌트 패스워드",currentPassword)
    //비크립트 떄문에 무조건 다를수밖에 없음
    console.log("패스워드", updatePassword)

    let body = {
      newName: UpdateName !== "" ? UpdateName : currentName,
      // password: currentPassword,
      newPassword: updatePassword !== "" ? updatePassword : currentPassword,
      newImage: filePath !== "" ? filePath : currentImage,
    };  
    
    if(updatePassword !== ""){
    axios.post('/api/users/modify',body)
    .then((response) => console.log("mypage",response.data.user))
    alert("회원정보가 수정되었습니다.");
    props.history.push("/"); //auth에서 먼저임
    } 
    else if(updatePassword == ""){
      axios.post("/api/user/nopassmodify", body)
      .then((response) => console.log("mypage",response.data.user))
      alert("회원정보가 수정되었습니다.");
      props.history.push("/"); //auth에서 먼저임
    }
  };
  

  //모르는 부분
  //비크립트 된 비밀번호가 넘어가는거 모르겠음.. 해쉬랑 패스워드가 같으니깐
  //데이터베이스에서 해쉬값을 커런트 비밀번호에 넣어도 되어야하는거 아닌가?
  //body를 2개 만들어주던가? 패스워드가 있는거하나랑 없는거 하나???
  //



  return (

    <div style={{
      display: 'flex', justifyContent: 'center', alignItems:'center'
      ,width: '100%', height: '100vh'
    }}>


  <DropZone onDrop={onDrop} multiple={false} maxSize={10000000}>
      {({ getRootProps, getInputProps }) => (
        <div
          style={{
            width: "300px",
            height: "240px",
            border: "1px solid lightgray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
            {...getRootProps()}
        >
      <input {...getInputProps()} />
    </div>
    )}
  </DropZone>

    {/* {currentImage !== "" && ( */}
            <div>
              <img 
                src={
                  currentImage
                    ? `http://localhost:5000/${
                        filePath ? filePath : currentImage
                      }`
                    : currentImage
                }
                alt="haha" />
            </div>
          {/* )} */}

      <form style={{display:'flex', flexDirection: 'column'}}
          onSubmit={onSubmitHandler}
      >

        <label>Name</label>
        <input type="text" value={UpdateName} onChange={onNameHandler}></input>

        {/* <label>currentPassword</label>
        <input type="password" value={currentPassword} onChange={onCurrentPassword}/> */}

        <label>New PassWord</label>
        <input type="password" value={updatePassword} onChange={onPasswordHandler} placeholder=""/>

        <label>Confirm PassWord</label>
        <input type="password" value={updatePasswordConfirm} onChange={onConfirmPasswordHandler}/>
        
        <br/>


        <button type = "submit">
          회원 수정
        </button>
      </form>
    </div>
  )
}

export default withRouter(MyPage)