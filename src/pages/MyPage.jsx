import React, { useContext, useEffect, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";
import { HealthContext } from "../context/HealthProvider";
import { MyBox, MyForm, MyInput, MyLabel, MyTitle } from "../styled/UserMyPageCompoment ";
import Swal from "sweetalert2";
// :흰색_확인_표시: 기본 프로필 이미지 URL (Supabase Storage에서 복사한 URL로 변경)

const DEFAULT_PROFILE_IMAGE = `https://gczslnpcrrjjtymyvvso.supabase.co/storage/v1/object/public/feed_img/public/mydefault.png`;
const MyPage = () => {
  const navigate = useNavigate();
  const { profileUrl, setProfileUrl, nickname, setNickname, email, setEmail, phoneNum, setPhoneNum } =
    useContext(HealthContext);
  console.log(":흰색_확인_표시: setProfileUrl 확인:", setProfileUrl);
  const [myNickname, setMyNickname] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myPhoneNum, setMyPhoneNum] = useState("");
  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log(":로켓: 사용자 정보 불러오기 시작");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error(":x: 사용자 정보를 불러오는 데 실패:", userError);
        return;
      }
      const userId = userData.user.id;
      const userEmail = userData.user.email;
      console.log(":흰색_확인_표시: 현재 로그인한 유저 ID:", userId);
      console.log(":흰색_확인_표시: 현재 로그인한 유저 이메일:", userEmail);
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("nickname, phone_num, profile_img")
        .eq("user_id", userId)
        .single();
      if (profileError) {
        console.error(":x: users 테이블에서 프로필 정보를 가져오는 데 실패:", profileError);
        return;
      }
      console.log(":흰색_확인_표시: users 테이블에서 불러온 프로필 정보:", userProfile);
      let profileImageUrl = DEFAULT_PROFILE_IMAGE;
      if (userProfile.profile_img) {
        profileImageUrl = `https://gczslnpcrrjjtymyvvso.supabase.co/storage/v1/object/public/feed_img/${userProfile.profile_img}`;
      }
      console.log("최종 프로필 이미지 URL:", profileImageUrl);
      setNickname(userProfile.nickname || "");
      setEmail(userEmail || "");
      setPhoneNum(userProfile.phone_num || "");
      if (typeof setProfileUrl === "function") {
        setProfileUrl(profileImageUrl);
      } else {
        console.warn("setProfileUrl is not defined");
      }
      setMyNickname(userProfile.nickname || "");
      setMyEmail(userEmail || "");
      setMyPhoneNum(userProfile.phone_num || "");
    };
    fetchUserInfo();
  }, []);
  const updateUserProfile = async () => {
    if (!myNickname || !myEmail || !myPhoneNum) {
      Swal.fire("모든 정보를 입력해주세요.");
      return;
    }
    // :흰색_확인_표시: 현재 로그인한 유저 정보 가져오기
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("사용자 정보를 가져오는 데 실패:", userError);
      return;
    }
    const userId = userData.user.id;
    // :흰색_확인_표시: 닉네임 중복 체크
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("user_id")
      .eq("nickname", myNickname)
      .neq("user_id", userId)
      .maybeSingle();
    if (checkError) {
      console.error("닉네임 중복 확인 중 오류 발생:", checkError);
      return;
    }
    if (existingUser) {
      Swal.fire("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }
    // :흰색_확인_표시: 사용자 정보 업데이트 (email → e_mail로 변경)
    const { error: updateError } = await supabase
      .from("users")
      .update({
        nickname: myNickname,
        phone_num: myPhoneNum,
        e_mail: myEmail, // :불: 수정된 부분!
      })
      .eq("user_id", userId);
    if (updateError) {
      console.error("프로필 업데이트 실패:", updateError);
      Swal.fire("업데이트 중 오류가 발생했습니다.");
      return;
    }
    Swal.fire("프로필이 성공적으로 업데이트되었습니다!");
    // Context API 상태 업데이트
    setNickname(myNickname);
    setEmail(myEmail);
    setPhoneNum(myPhoneNum);
  };

  // 이미지 업로드 함수 추가
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profile_images/${fileName}`;
    try {
      let { data, error: uploadError } = await supabase.storage.from("feed_img").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) {
        Swal.fire("이미지 업로드에 실패했습니다.");
        return;
      }
      const { data: publicURLData } = supabase.storage.from("feed_img").getPublicUrl(filePath);
      const newProfileImageUrl = publicURLData.publicUrl;
      setProfileUrl(newProfileImageUrl);
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      Swal.fire("업로드 중 문제가 발생했습니다.");
    }
  };
  // 이미지 삭제 함수 추가
  const handleProfileImageDelete = async () => {
    setProfileUrl(DEFAULT_PROFILE_IMAGE);
  };
  const moveFeedMain = () => {
    navigate("../feedmain");
  };
  return (
    <MyBox>
      <MyTitle>My Page</MyTitle>
      <img src={profileUrl || DEFAULT_PROFILE_IMAGE} alt="Profile" width={200} />
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImageUpload}
        style={{ display: "none" }}
        id="fileInput"
      />
      <button onClick={() => document.getElementById("fileInput").click()}>이미지 수정하기</button>
      <button onClick={handleProfileImageDelete}>이미지 삭제하기</button>
      <MyForm>
        <MyLabel>
          <label>닉네임:</label>
          <MyInput type="text" value={myNickname} onChange={(e) => setMyNickname(e.target.value)} />
          <label>e-mail:</label>
          <MyInput type="email" value={myEmail} onChange={(e) => setMyEmail(e.target.value)} />
          <label>휴대폰:</label>
          <MyInput type="text" value={myPhoneNum} onChange={(e) => setMyPhoneNum(e.target.value)} />
          {/*수정 버튼에 onClick 이벤트 추가 */}
          <button type="button" onClick={updateUserProfile}>
            수정하기
          </button>
          <button onClick={moveFeedMain}>뒤로가기</button>
        </MyLabel>
      </MyForm>
    </MyBox>
  );
};
export default MyPage;
