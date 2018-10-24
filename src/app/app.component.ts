import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProjectService } from './project/project.service';
import { Project } from './project/project';
import { ChromeExtensionInterfaceService } from './core/chrome-extension-interface/chrome-extension-interface.service';
import { ShortcutService } from './core/shortcut/shortcut.service';
import { checkKeyCombo } from './core/util/check-key-combo';
import { ConfigService } from './core/config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class') private _currentTheme: string;

  public isShowAddTaskBar = false;


  constructor(
    private _configService: ConfigService,
    private _shortcutService: ShortcutService,
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    private _overlayContainer: OverlayContainer,
    private _projectService: ProjectService,
    private _chromeExtensionInterface: ChromeExtensionInterfaceService,
  ) {
    this._matIconRegistry.addSvgIcon(
      `sp`,
      this._domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/sp.svg`)
    );
    this._chromeExtensionInterface.init();
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(ev: KeyboardEvent) {
    this._shortcutService.handleKeyDown(ev);
    if (checkKeyCombo(ev, this._configService.cfg.keyboard.addNewTask)) {
      this.isShowAddTaskBar = !this.isShowAddTaskBar;
    }
  }

  ngOnInit() {
    this._projectService.currentProject$.subscribe((currentProject: Project) => {
      this._setTheme(currentProject.themeColor + (currentProject.isDarkTheme ? '-dark' : ''));
    });
  }

  private _setTheme(theme) {
    if (this._currentTheme) {
      this._overlayContainer.getContainerElement().classList.remove(this._currentTheme);
    }

    this._overlayContainer.getContainerElement().classList.add(theme);
    this._currentTheme = theme;
  }
}
