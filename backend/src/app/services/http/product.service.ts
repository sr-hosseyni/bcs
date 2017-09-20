import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions, RequestOptionsArgs, URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Product} from '../../entities/product';
import {Category} from '../../entities/category';

@Injectable()
export class ProductService {
    private productUrl: '/product';

    constructor(private http: Http) {
    }

    all(category: any): Observable<Product[]> {

//        let params = {
//            "filter_groups": [
//                {
//                    "filters": [
//                        {
//                            "key": "category_id",
//                            "value": category.id,
//                            "operator": "eq"
//                        }
//                    ]
//                }
//            ]
//        };
//        let options = new RequestOptions({params: params});

        return this.http.get('/product?' + 'filter_groups[0][filters][0][key]=category_id&filter_groups[0][filters][0][value]=' + category.id + '&filter_groups[0][filters][0][operator]=eq')
            .map(this.extractData)
            .catch(this.handleError);
    }

    get(id: number): Observable<Product[]> {
        return this.http.get('/product/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    create(product: Product): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.post('/product', product.transform(), options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    update(product: Product): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.put('/product/' + product.id, product.transform(), options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    remove(product: Product): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.delete('/product/' + product.id, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    extractData(res: Response) {
        let body = res.json();
        return body.products || {};
    }

    handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
