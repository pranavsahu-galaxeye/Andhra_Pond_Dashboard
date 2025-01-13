import { useState, useContext } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import logo from "../../../public/Images/galaxeye-white.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "unofeeds@galaxeye.blue" && password === "unofeeds@blue#1") {
      login();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="flex justify-end items-center h-screen bg-cover bg-center relative p-20 box-border"
      style={{ backgroundImage: "url('../../../public/Images/image 80.png')" }}
    >
      <div className="absolute inset-8 bg-[#053c3ab3] bg-opacity-70 text-white flex items-end p-5 rounded-2xl box-border z-10">
        <p className="text-left max-w-[50%] mb-24 text-lg">
          &quot;Your unbiased source of intelligence for Aquaculture, leveraging
          Satellite Imagery and AI&quot;{" "}
        </p>
      </div>
      <div className="bg-gradient-to-r from-[#121212] via-[#09302e] to-[#053C3A] rounded-2xl shadow-lg p-4 px-5 py-7 h-full max-h-[420px] w-full max-w-[360px] box-border relative z-20">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <img src={logo} alt="GalaxEye Logo" className="w-36 mb-6" />
          <h2 className="text-white text-2xl font-semi-bold mb-6">
            Login to your account
          </h2>
          <div className="mb-5 w-full">
            <label className="sr-only">Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-white border-opacity-80 rounded-2xl text-white bg-transparent placeholder-white placeholder-opacity-80 focus:outline-none"
            />
          </div>
          <div className="mb-5 w-full">
            <label className="sr-only">Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-white border-opacity-80 rounded-2xl text-white bg-transparent placeholder-white placeholder-opacity-80 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-[#00B894] text-black rounded-2xl hover:bg-teal-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
