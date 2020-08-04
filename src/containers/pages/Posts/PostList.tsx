import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  InputBase,
  IconButton,
  Button,
  Grid,
} from "@material-ui/core";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  NoteAdd as NoteAddIcon,
} from "@material-ui/icons";
import Swal from "sweetalert2";
import { PostConverter } from "../../../utils/firebasePostConverter";
import { firestore } from '../../../config/firebase';
import IPost from "../../../interfaces/IPost";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
    rootSearch: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

let unsubscribe: any;

export default function PostList() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [posts, setPosts] = useState<IPost[]>([])
  const [search, setSearch] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteData = async (id: string) => {
    await firestore.doc(`posts/${id}`).delete();
    Swal.fire(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  }

  const handleDeletePost = (postId: string) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        deleteData(postId)
      }
    })
  }

  useEffect(() => {
    const getDataFromFirestore = () => {
      unsubscribe = firestore.collection('posts').withConverter(PostConverter).onSnapshot(docs => {
        let data: IPost[] = [];
        docs.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        });
        setPosts(data)
      });
    };
    getDataFromFirestore();
    return () => {
      unsubscribe()
    }
  }, []);

  return (
    <>
      <Grid container>
        <Grid xs={12} sm={6} item>
          <Paper component="form" className={classes.rootSearch}>
            <InputBase
              className={classes.input}
              placeholder="Search by title"
              inputProps={{ 'aria-label': 'Search by title' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid xs={12} sm={6} container justify="flex-end" item>
          <Link to="/dashboard/posts/create" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<NoteAddIcon />}
            >
              Create Post
        </Button>
          </Link>
        </Grid>
      </Grid>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((post) => {
                  return (
                    <TableRow hover key={post.id}>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.body}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeletePost(post.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={posts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper >
    </>
  );
}
