// 동우님에게 setNickname(existData[0].nickname);가 아닌 setusers로 변경 부탁할것
// 동우님에게 30번째줄.select("nickname") 별표로 받아올것 user가 필요
import React, { useContext, useEffect, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";
import { HealthContext } from "../context/HealthProvider";

const DEFAULT_PROFILE_IMAGE = "https://your-default-image-url.com/default.png"; // 디폴트 프로필 이미지 URL
// css, 이미지 경로수정, 아래쪽 주석들 보고 질문

const MyPage = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const fetchMyPosts = async () => {
    setLoadingPosts(true); // 수정 필요
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("사용자 정보를 가져오는 데 실패했습니다:", userError);
      setLoadingPosts(false);
      return;
    }
    const userId = userData?.user?.id;
    if (!userId) {
      console.error("사용자 ID를 찾을 수 없습니다.");
      setLoadingPosts(false);
      return;
    }
    const { data: posts, error: postError } = await supabase
      .from("feeds")
      .select("*")
      .eq("user_id", userId);
    if (postError) {
      console.error("게시물을 가져오는 데 실패했습니다:", postError);
    } else {
      setMyPosts(posts);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const navigate = useNavigate();
  const {
    profileUrl,
    setProfileUrl,
    nickname,
    setNickname,
    email,
    setEmail,
    phoneNum,
    setPhoneNum,
  } = useContext(HealthContext);
  const [myNickname, setMyNickname] = useState(nickname);
  const [myEmail, setMyEmail] = useState(email);
  const [myPhoneNum, setMyPhoneNum] = useState(phoneNum);
  const [isMyUploading, isSetMyUploading] = useState(false);

  // 닉네임 중복 검사
  const checkMyNickname = async (myNickname) => {
    const { data, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", myNickname);

    if (error) {
      console.error("닉네임 중복 검사 실패:", error);
      return false;
    }

    return data.length > 0; // 중복된 닉네임이 있으면 true 반환
  };

  // 회원 정보 업데이트
  const handleMyProfileUpdate = async () => {
    const updates = {}; // 변경된 데이터만 저장

    // 닉네임 변경 시 중복 검사 후 업데이트 진행
    if (myNickname && myNickname !== nickname) {
      const exists = await checkMyNickname(myNickname);
      if (exists) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      }
      updates.nickname = myNickname;
    }

    if (myEmail && myEmail !== email) updates.email = myEmail;
    if (myPhoneNum && myPhoneNum !== phoneNum) updates.phoneNum = myPhoneNum;

    if (Object.keys(updates).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("nickname", nickname);

    if (error) {
      alert("프로필 업데이트 실패");
      console.error("업데이트 오류:", error);
      return;
    }

    // Context 상태 업데이트
    if (updates.nickname) setNickname(updates.nickname);
    if (updates.email) setEmail(updates.email);
    if (updates.phoneNum) setPhoneNum(updates.phoneNum);

    alert("회원 정보가 업데이트되었습니다!");
  };

  // 프로필 이미지 업로드
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    isSetMyUploading(true);

    const filePath = `profiles/${nickname}_${Date.now()}.png`; // 경로 질문!!

    const { error: uploadError } = await supabase.storage
      .from("profile_pictures")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("이미지 업로드 실패");
      isSetMyUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("profile_pictures")
      .getPublicUrl(filePath);

    const newProfileUrl = data.publicUrl;

    // DB 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_url: newProfileUrl })
      .eq("nickname", nickname);

    if (updateError) {
      alert("프로필 이미지 업데이트 실패");
      return;
    }

    setProfileUrl(newProfileUrl); // 상태 업데이트
    isSetMyUploading(false);
  };

  return (
    <div>
      <h2>My Page</h2>
      <img
        src={profileUrl || DEFAULT_PROFILE_IMAGE}
        alt="Profile"
        width={150}
      />
      <button onClick={() => document.getElementById("profile-upload").click()}>
        이미지 수정하기
      </button>
      <input
        id="profile-upload"
        type="file"
        accept="image/*" // 경로 체크 !!
        onChange={handleImageUpload}
        hidden
      />
      <input
        type="file"
        accept="image/*" // 경로 체크 !!
        onChange={handleImageUpload}
        disabled={isMyUploading}
      />
      {isMyUploading && <p>업로드 중...</p>}
      <label>닉네임:</label>
      <input
        type="text"
        value={myNickname}
        onChange={(e) => setMyNickname(e.target.value)}
      />
      <label>e-mail:</label>
      <input
        type="email"
        value={myEmail}
        onChange={(e) => setMyEmail(e.target.value)}
      />
      <label>휴대폰:</label>
      <input
        type="text"
        value={myPhoneNum}
        onChange={(e) => setMyPhoneNum(e.target.value)}
      />
      <button onClick={fetchMyPosts}>내 게시물 보기</button>
      <button onClick={handleMyProfileUpdate}>수정하기</button>
      <button onClick={() => navigate(-1)}>뒤로가기 </button>
    </div>
  );
};

export default MyPage;
