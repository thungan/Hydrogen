import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection1 = collections.nodes[0];/** get the first collection*/
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  
     const fgc123 =  await storefront.query(COLLECTIONS_QUERY);
      return defer({featuredCollection, recommendedProducts, fgc123,featuredCollection1});
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();  
  const dd = data.fgc123.collections; /**ko use dc khi lk voi shopy
*/
  const hh = data.featuredCollection.collections;
  /**console.log(data.recommendedProducts)*/
 console.log(dd)

  return (
    <div className="home">
     
     

        <section className="w-full gap-4">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
        3 Collections
      </h2>
         <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-3">
        {hh.nodes.map((collection) => {
         return (
            <Link to={`/collections/${collection.handle}`} key={collection.id}>
              <div className="grid gap-4">
                {collection?.image && (
                  <Image
                    alt={`Image of ${collection.title}`}
                    data={collection.image}
                    key={collection.id}
                    sizes="(max-width: 200px) 20vw, 50vw"
                    aspectRatio="1/1"
                    crop="center"
                    className="image-collections"
                  />

                )}
                <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                  {collection.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
      <FeaturedCollectionfgc  a="test by thungan"/>
      <FeaturedCollection123 collection={data.featuredCollection1} />
      <RecommendedProducts products={data.recommendedProducts} />           
      

    </div>
  );
}


/**
 * @param {{
 *   collections: listCollectons;
 * }}
 */
function ListCollectons123({aaa}) {
  return (
      <section className="w-full gap-4">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
        Collections
      </h2>

      <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-3">
        {aaa.nodes.map((collection) => {
          return (
            <Link to={`/collections/${collection.handle}`} key={collection.id}>
              {collection.title}
            </Link>
          );
        })}
      </div>
    </section>
  
  );

}


/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
 function FeaturedCollectionfgc({a}) {
  return (

      <h1>feature Collection {a}</h1>
               

  );
}

function FeaturedCollection123({collection}) {

  if (!collection) return null;
  const image = collection?.image;
  return (

    <Link      className="featured-collection"  to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
              

  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products 333</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}


/** add by thungan */


const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections{
    collections(first: 3, query: "collection_type:smart") {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;


const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
