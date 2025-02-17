import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 상태관리를 해주는 context 생성
export const HealthContext = createContext(null);
const HealthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [searchedFeed, setSearchedFeed] = useState([]);
  const navigate = useNavigate();

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    // supabase를 사용하여 로그인을 요청(email,password)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: pwInput,
      });
      // 로그인 실패 시 예외처리
      if (error) {
        throw error;
      }

      // alert("로그인 성공");

      //로그인 성공 시 사용자의 id,email정보 불러오기
      const userId = data.user.id;
      const userEmail = data.user.email;

      // users 테이블에서 사용자의 정보 가져오기(닉네임)
      const { data: existData, error: selectError } = await supabase
        .from("users")
        .select("nickname")
        // 로그인한 사용자의 user_id와 일치하는 id를 조회함
        .eq("user_id", userId);

      // 테이블 조회 오류
      if (selectError) {
        console.log("user 테이블 조회 오류", selectError);
        return;
      }

      // 데이터 조회시 닉네임의 상태 업데이트
      if (existData) {
        setNickname(existData[0].nickname);
      }
      // 업데이트 한 닉네임을 받아 alert창 표시
      Swal.fire(`${existData[0].nickname}님 환영합니다!`);
      navigate("/feedmain");
    } catch (error) {
      console.log("로그인 오류", error);
    }
  };

  const handleMoveJoin = () => {
    navigate("/join");
  };

  const value = {
    email,
    setEmail,
    password,
    setPassword,
    nickname,
    setNickname,
    phoneNum,
    setPhoneNum,
    handleLogin,
    emailInput,
    setEmailInput,
    pwInput,
    setPwInput,
    handleMoveJoin,
    searchKey,
    setSearchKey,
    searchedFeed,
    setSearchedFeed,
  };
  // context provider로 감싸준 후 자식 컴포넌트들에게 데이터를 넘겨줌
  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
};

export default HealthProvider;
