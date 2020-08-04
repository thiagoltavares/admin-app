import React from "react";
import { Route } from "react-router-dom";
import PostList from "./PostList";
import PostForm from "./PostForm";

const Posts: React.FC = () => {

  return (
    <>
      <Route path="/dashboard/posts/create" component={PostForm} />
      <Route path="/dashboard/posts/edit/:id" component={PostForm} />
      <Route path="/dashboard/posts/" exact component={PostList} />
    </>
  )
}

export default Posts;