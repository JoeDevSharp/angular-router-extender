import { Directive, ElementRef, HostListener, Input, OnChanges  } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { RouterExtenderNavigate } from '../_interfaces/RouteExtender';
import { RouteExtender } from '../_interfaces/RouteExtender';

@Directive({
  selector: '[to]'
})
export class RouterLinkDirective implements OnChanges {

  @Input('to') routerNavigate! : RouterExtenderNavigate

  private routerLink: Array<string> = []

  constructor(
    private router: Router,
    private el: ElementRef
  ) { }

  ngOnChanges () {
    // Condicion de salida de la funcion recursiva :
    this.routerLink = this.routerLinkContructor(
      this.getRouterConfingList()
    )
    // Evenement qui detecte le changement de route
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.activeClassName()
      }
    });
    this.activeClassName()
  }

  @HostListener('click') onClic() {
    this.activeClassName()
    this.router.navigate(this.routerLink)
  }


  private activeClassName() {

    const routerLastPath = this.routerLink[this.routerLink.length - 1]
    const actualLastPath = window.location.href.split('/')[window.location.href.split('/').length - 1]

    if (routerLastPath === actualLastPath ) {
      this.el.nativeElement.classList.add(this.routerNavigate.activeClass )
    }else{
      this.el.nativeElement.classList.remove(this.routerNavigate.activeClass )
    }

  }

  // On recupere la liste complete de routerConfig
  private getRouterConfingList (): RouteExtender[] {
    return this.router.config as RouteExtender[]
  }

  // Cette fonction permet de verifier si le nom du router que on cherche correspond
  private routerNameVerify (routerName: string): boolean {
    return routerName === this.routerNavigate.name
  }

  // Cette fonction permet de contruir la rute
  private routerLinkContructor (
    routerConfig: RouteExtender[],
    routerLink: Array<string> = []
  ): Array<string> {

    // Iteration du routerConging
    for (const route of routerConfig) {
      routerLink.push(route.path ? route.path : '')
      // Si le nom correspond on construit le route
      if (this.routerNameVerify(route.name)) {
        break
      }else{
        // Si Exit children
        if (route.children !== undefined && route.children !== null) {
          this.routerLinkContructor(route.children, routerLink)
        }else{
          routerLink.pop()
        }
      }
    }

    return routerLink
  }

}
