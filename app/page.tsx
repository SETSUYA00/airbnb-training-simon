import React, { FC, Suspense } from "react";

import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";
import EmptyState from "@/components/EmptyState";

import { getListings } from "@/services/listing";
import { getFavorites } from "@/services/favorite";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams?: { [key: string]: string | undefined };
}

type Listing = {
  id: string;
  // Add other properties as needed, e.g. title, description, etc.
  [key: string]: any;
};

const Home: FC<HomeProps> = async ({ searchParams }) => {
  const { listings, nextCursor } = await getListings(searchParams);
  const favorites = await getFavorites();

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No Listings found"
        subtitle="Looks like you have no properties."
      />
    );
  }

  return (
    <section className="main-container pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
      {/* === SIMON'S TEST CHANGE - VISIBLE BANNER === */}
      <div className="col-span-full text-center mb-12">
        <h1 className="text-5xl font-bold text-red-600">
          Airbnb Training - Simon was here! 🚀
        </h1>
      </div>
      {listings.map((listing: Listing) => {
        const hasFavorited = favorites.includes(listing.id);
        return (
          <ListingCard
            key={listing.id}
            data={listing}
            hasFavorited={hasFavorited}
          />
        );
      })}
      {nextCursor ? (
        <Suspense fallback={<></>}>
          <LoadMore
            nextCursor={nextCursor}
            fnArgs={searchParams}
            queryFn={getListings}
            queryKey={["listings", searchParams]}
            favorites={favorites}
          />
        </Suspense>
      ) : null}
    </section>
  );
};

export default Home;