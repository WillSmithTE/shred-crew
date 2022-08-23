import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import HeadSection from "./HeadSection";
import FeatureSection from "./FeatureSection";
import {BlogSection} from './BlogSection'

function Home(props) {
  const { selectHome, openRegisterDialog, blogPosts, selectBlog } = props;
  useEffect(() => {
    selectHome();
  }, [selectHome]);
  return (
    <Fragment>
      <HeadSection openRegisterDialog={openRegisterDialog} />
      <FeatureSection />
      <BlogSection blogPosts={blogPosts} selectBlog={selectBlog} />
      {/* <PricingSection /> */}
    </Fragment>
  );
}

Home.propTypes = {
  selectHome: PropTypes.func.isRequired,
  openRegisterDialog: PropTypes.func.isRequired,
  blogPosts: PropTypes.arrayOf(PropTypes.object),
  selectBlog: PropTypes.func.isRequired,
};

export default Home;
