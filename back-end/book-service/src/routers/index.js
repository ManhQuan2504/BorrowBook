import bookRouter from "./bookRouter.js";


const routes = (app) => {
    app.use('/api/v1/book', bookRouter);
}

export default routes;