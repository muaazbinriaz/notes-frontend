import { LuLoaderCircle } from "react-icons/lu";
const RoundedLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LuLoaderCircle className="animate-spin h-10 w-10 text-gray-300 " />
    </div>
  );
};

export default RoundedLoader;
