import React from "react";
import type { Offer } from "../types/generated/menu";

type Props = {
  offers?: Offer | Offer[];
  headingLevel?: number;
  showHeading?: boolean;
};

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function describeOffer(offer: Offer): string {
  const parts: string[] = [];
  if (offer.price !== undefined && offer.price !== "") {
    const price =
      typeof offer.price === "number" ? offer.price.toString() : offer.price;
    parts.push(offer.priceCurrency ? `${offer.priceCurrency} ${price}` : price);
  }
  if (offer.availabilityStarts || offer.availabilityEnds) {
    const start = offer.availabilityStarts;
    const end = offer.availabilityEnds;
    if (start && end) {
      parts.push(`${start} – ${end}`);
    } else if (start) {
      parts.push(`Starts ${start}`);
    } else if (end) {
      parts.push(`Ends ${end}`);
    }
  }
  return parts.join(" · ");
}

function clampHeading(level: number | undefined): number {
  if (!level) {
    return 2;
  }
  return Math.min(6, Math.max(1, level));
}

export default function MenuOffers({
  offers,
  headingLevel = 2,
  showHeading = true,
}: Props) {
  const offerList = toArray(offers)
    .map((offer) => describeOffer(offer))
    .filter(Boolean);

  if (offerList.length === 0) {
    return null;
  }

  if (!showHeading) {
    return (
      <ul>
        {offerList.map((text, index) => (
          <li key={`${text}-${index}`}>{text}</li>
        ))}
      </ul>
    );
  }

  const Heading = `h${clampHeading(headingLevel)}`;

  return (
    <section>
      {React.createElement(Heading, null, "Offers")}
      <ul>
        {offerList.map((text, index) => (
          <li key={`${text}-${index}`}>{text}</li>
        ))}
      </ul>
    </section>
  );
}
