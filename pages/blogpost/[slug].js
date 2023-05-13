import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/BlogPost.module.css";
import * as fs from "fs";

const Slug = (props) => {
  function createMarkup(c) {
    //using dangerouslySetInnerHTML
    return { __html: c };
  }

  const [blog, setBlog] = useState(props.myBlog);

  //const router = useRouter();
  // useEffect(() => {
  //   if (!router.isReady) return;
  //   const { slug } = router.query;
  //   fetch(`http://localhost:3000/api/getblog?slug=${slug}`)
  //     .then((a) => {
  //       return a.json();
  //     })
  //     .then((parsed) => {
  //       setBlog(parsed);
  //     });
  // }, [router.isReady]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{blog && blog.title}</h1>
        <hr />
        {blog && (
          <div dangerouslySetInnerHTML={createMarkup(blog.content)}></div> //using dangerouslySetInnerHTML
        )}
      </main>
    </div>
  );
};
//STATIC-SIDE-RENDRING
export async function getStaticPaths() {
  let allb = await fs.promises.readdir(`blogdata`);
  allb = allb.map((item) => {
    return { params: { slug: item.split(".")[0] } };
  });
  //console.log(allb);
  return {
    paths: allb,
    fallback: true, // false or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;

  let myBlog = await fs.promises.readFile(`blogdata/${slug}.json`, "utf-8");

  return {
    props: { myBlog: JSON.parse(myBlog) }, // will be passed to the page component as props
  };
}

//SERVER-SIDE-RENDRING
// export async function getServerSideProps(context) {
//   // console.log(context.query)
//   // const router = useRouter();
//   const { slug } = context.query;

//   let data = await fetch(`http://localhost:3000/api/getblog?slug=${slug}`);
//   let myBlog = await data.json();
//   return {
//     props: { myBlog }, // will be passed to the page component as props
//   };
// }
export default Slug;
