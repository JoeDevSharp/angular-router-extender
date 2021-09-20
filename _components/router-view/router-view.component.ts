import {
  Input,
  Type,
  OnChanges,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  EventEmitter,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Event,
  NavigationEnd,
 } from "@angular/router";


@Component({
  selector: 'router-view',
  templateUrl: './router-view.component.html',
})

export class RouterViewComponent implements OnChanges {
  /**
   * Le parametres de type Input c'est un object de correspondence
   * entre la cle et la valeur qui corresponde a la valeur de l'attribute
   * du template.
   */
  @Input() params?: any = null;
  /**
   * Le parametre Emit est un object de correspondance entre la cle qui correspond
   * a le nom d'EmitEvents et la valeur qui correspond a la function a executer.
   */
  @Input() emits: any = null;

  /**
   * Pointeur Template.
   */
  @ViewChild("viewContainerRef", { read: ViewContainerRef } as any)

  /**
   * Représente un conteneur où une ou plusieurs vues peuvent être attachées à un composant.
   */
  private viewContainserRef: ViewContainerRef | any
  private componentsReferences: Array<ComponentRef<any>> = []
  /**
   * Le constructor qui ajouter un observable dans le router pour detecter
   * le changement.
   * @param componentFactoryResolver
   * @param route
   * @param router
   */
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Evenement qui detecte le changement de route
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.createComponent()
      }
    });
  }

  /**
   * Si il y a de changement dans le params on met a jour.
   */
  ngOnChanges() {
    this.createComponent()
  }

  /**
   * Returne le composent importer dans le router en fonction du router active
   * @returns Component importe dans le router.
   */
  _Composent(): Type<any> {
    const parentPath = this.route.routeConfig?.path?.split('/')[this.route.routeConfig.path.split('/').length - 1]
    const currentPath = this.router.url.split('/')[this.router.url.split('/').length - 1]

    let currentComponent = (this.route.routeConfig?.children as any).find((child: any) => {
      let isPathBase = (parentPath == currentPath)
      return isPathBase
        ? child.path == ""
        : child.path == currentPath
    }).component
    return currentComponent
  }

  /**
   * Cree une nouvelle instance de composant importer dans le route active
   */
  createComponent() {
    this.remove()
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this._Composent());
    let _composent = this.viewContainserRef.createComponent(componentFactory);

    // add reference for newly created component
    this.componentsReferences.push(_composent);
    this._inputs(_composent.instance, componentFactory.inputs, this.params)
    this._outputs(_composent.instance)
  }

  /**
   * Recupere le params de <router-view> pour realiser une correspondence entre le
   * diferent components et l'injecte dans le composent cree dinamiquement
   * @param instance Instance du component importar par le router
   * @param inputs Liste d'impint que le component contiens
   * @param params L'object de parametres reçu depuis le template
   */
   _inputs (instance: any, inputs: any , params: any) {
    const propsNames: any = params ? Object.keys(params) :  null
    if (propsNames) {
      inputs.forEach((input: any) => {
        instance[propsNames.find((i: any) => i = input)] = params[input.templateName]
      })
    }
  }

  // Recupere tout le output et ajouter a evenement Emiteur
  _outputs (intance: any) {
    const emitsNames: any = this.emits ? Object.keys(this.emits) : []
    emitsNames.forEach((emit: string) => {
      if (intance[emit] !== undefined) {
        (intance[emit]).subscribe((event: any )=> {
          this.emits[emit](event)
        });
      }
    });
  }

  /**
   * Efface tout le composent qui ne corresponde pas au router actuelle.
   */
  remove() {
    if (this.viewContainserRef.length < 1) return;
    let componentRef = this.componentsReferences
    componentRef.forEach(item => {
      let vcrIndex: number = this.viewContainserRef.indexOf(item as any);
      // removing component from container
      this.viewContainserRef.remove(vcrIndex);

      // removing component from the list
      this.componentsReferences.filter(x => false)
    })
  }
}
