export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-white dark:bg-darkBg">
      <div className="flex items-center gap-x-1">
        <span className="w-2 h-2 rounded-full bg-grayHover dark:bg-white dark:bg-opacity-30 animate-loading1"></span>
        <span className="w-2 h-2 rounded-full bg-grayHover dark:bg-white dark:bg-opacity-30 animate-loading2"></span>
        <span className="w-2 h-2 rounded-full bg-grayHover dark:bg-white dark:bg-opacity-30 animate-loading3"></span>
      </div>
    </div>
  );
}
