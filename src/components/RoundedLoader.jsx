import { LuLoaderCircle } from "react-icons/lu";
const RoundedLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LuLoaderCircle className="animate-spin h-13 w-13 text-gray-300 " />
    </div>
  );
};

export default RoundedLoader;
