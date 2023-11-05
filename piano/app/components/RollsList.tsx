import Link from "next/link";
import { useAppSelector } from "../redux/hooks";
import parseSvgElement from "../utils/parseSvgElement";

const RollsList = () => {
  const rollsList = useAppSelector((state) => state.rollsList.items);

  return (
    <div className="flex  flex-col gap-[2rem] overflow-auto md:col-span-3 lg:col-span-2">
      {rollsList.map((roll, index) => {
        const svgElement = parseSvgElement(roll.svgElement);
        return (
          <Link
            key={index}
            href={{
              pathname: "/main-view",
              query: { id: index },
            }}
            className=" h-[20vh] md:h-[15vh]"
            dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }}
          ></Link>
        );
      })}
    </div>
  );
};

export default RollsList;
