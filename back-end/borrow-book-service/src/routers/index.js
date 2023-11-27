import borrowBookRouter from "./borrowBookRoute.js"

const router = (app) => {
    app.use('/api/v1/borrowbook', borrowBookRouter);
}

export default router;