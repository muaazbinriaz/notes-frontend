import { LuLoaderCircle } from "react-icons/lu";
const RoundedLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LuLoaderCircle className="animate-spin h-15 w-15 " />
    </div>
  );
};

export default RoundedLoader;
