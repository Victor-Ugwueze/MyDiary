import app from '../app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server startted on port: ${port}`);
});

export default app;
