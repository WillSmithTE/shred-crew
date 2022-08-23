import React from "react";
import { Typography } from "@mui/material";
import { withTheme } from "@mui/styles";
import PropTypes from "prop-types";
import Blog from "../blog/Blog";

export const BlogSection = withTheme((props) => {
  const { blogPosts, selectBlog } = props;

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" >
          Blog
        </Typography>
          <Blog selectBlog={selectBlog} blogPosts={blogPosts.slice(0, 3)} />
      </div>
    </div>
  );
})

BlogSection.propTypes = {
  selectBlog: PropTypes.func.isRequired,
  blogPosts: PropTypes.arrayOf(PropTypes.object),
};
