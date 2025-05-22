import Navbar from "../../components/Navbar/Navbar";

export default function BaseLayout({ children }) {
  return (
    <div className="w-full h-fit min-h-screen font-medium">
      <Navbar />
      <div className="w-full h-fit">{children}</div>
    </div>
  );
}
