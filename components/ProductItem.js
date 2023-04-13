/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Suspense } from "react";
export default function ProductItem({ product, addItemClick }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="card hover:scale-105 ease-in-out duration-100">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="rounded shadow object-cover h-80 w-full"
          />
        </Link>
        <div className="flex flex-col items-center justify-center p-5">
          <Link legacyBehavior href={`/product/${product.slug}`}>
            <a>
              <h2 className="text-lg">{product.name}</h2>
            </a>
          </Link>
          <p className="mb-2">{product.brand}</p>
          <p>${product.price}</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => addItemClick(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </Suspense>
  );
}
