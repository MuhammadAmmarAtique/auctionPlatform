import { useSelector } from "react-redux";
import {Card} from "../Card";

const FeaturedAuctions = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  return (
    <>
      <section className="my-8">
        <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
          Featured Auctions
        </h3>
        <div className="flex flex-wrap gap-6">
          {allAuctions.slice(0, 8).map((auction) => {
            return (
              <Card
                title={auction.title}
                imgSrc={auction.image?.url}
                startTime={auction.startTime}
                endTime={auction.endTime}
                startingBid={auction.startingBid}
                id={auction._id}
                key={auction._id}
              />
            );
          })}
        </div>
      </section>
    </>
  );
};

export default FeaturedAuctions;
