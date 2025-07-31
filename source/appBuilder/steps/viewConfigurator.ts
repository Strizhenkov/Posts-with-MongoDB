import express, {Express} from 'express';

export class ViewConfigurator {
    configure(app: Express) {
        try {
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            app.set('views', './source/views');
            app.set('view engine', 'ejs');
            app.use(express.static('./source/static'));
            console.log("3) View engine and static files configured.");
        } catch (err) {
            console.error("3) View configuration failed:", err);
            throw err;
        }
    }
}