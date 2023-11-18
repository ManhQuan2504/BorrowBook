import bookRouter from "./bookRouter.js";


const routes = (app) => {
    app.use('/api/book', bookRouter);
}

export default routes;