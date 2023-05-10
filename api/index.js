const app = require('./src/app.js');
const { conn } = require('./src/db.js');
const { loadUsers } = require('./src/routes/users.js');
const { loadProducts } = require('./src/routes/products.js');

// Syncing all the models at once.


  // conn.sync({ force: false }).then(() => {
  //   app.listen(process.env.PORT, () => {
  //     console.log(`Backend en puerto ${process.env.PORT}`); // eslint-disable-line no-console
  //   });
  // });

  conn.sync({ force: false })
  .then(async () => {
    await loadUsers();
    await loadProducts();
    app.listen(process.env.PORT, () => {
      console.log(`Backend en puerto ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error al conectar con la base de datos: ', error);
  });

