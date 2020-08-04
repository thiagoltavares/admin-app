import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { firestore } from "../../../config/firebase";
import { Button, TextField } from '@material-ui/core';
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";


export default function PostForm() {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const history = useHistory();

  const saveToFirestore = async () => {
    if (!title || !body) {
      Swal.fire({
        title: `Dados incorretos`,
        text: "Você precisa preencher TODOS os campos",
        icon: 'error',
      })
      return
    }

    await firestore.collection('posts').add({
      title,
      body
    });

    Swal.fire({
      title: `Você criou um novo Post`,
      text: "Seu post já está disponível",
      icon: 'success',
      showCancelButton: false,
    })
    setTitle('')
    setBody('')
    history.push('/dashboard/posts')
  }

  return (
    <div>
      <TextField
        id="outline-basic"
        label="Title"
        variant="outlined"
        style={{ width: '100%', marginBottom: 10 }}
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <Editor
        apiKey={process.env.REACT_APP_TINY_CLOUD_API_KEY}
        value={body}
        init={{
          height: 500,
          menubar: 'file edit view insert format tools table tc help',
          plugins: [
            'advlist autolink lists link image',
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount'
          ],
          toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
        }}
        onChange={(e: any) => setBody(e.target.getContent())}
      />
      <Button onClick={saveToFirestore} variant="contained" style={{ marginTop: 10 }} color="primary" >Save</Button>
    </div>
  );
}