import { Route } from '@angular/router'

export declare interface RouteExtender extends Route {
    name: string,
    title?: string,
    params?: Array<any>,
    children?: RouteExtender[] // Override
}

export declare interface RouterExtenderNavigate {
  name: string,
  params?: Array<any>,
  activeClass?: string
}

export declare interface breadcrumb {
    name?: string,
    value: any
}