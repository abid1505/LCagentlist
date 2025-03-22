import { Component , Inject , ElementRef , ViewChild , AfterViewInit  } from '@angular/core';
import { Title } from '@angular/platform-browser';
declare const translateLanguage: any;
import { environment } from "src/environments/environment";
import { DOCUMENT } from '@angular/common';
import { LocationStrategy } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { MainService } from './main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit  {
  title = 'lcagent';
showdata:boolean=false
serachtab:boolean=false
siteName = environment.siteName;

WLID: any
type = 3;
listArray: any;
Name = "Home";
supportList: any;
openreports: boolean;
openViews: boolean;
ViewList: any[] = []
ReportList: any[] = []
listAllData: any[] = [];
opensidebarmenu: boolean;
agentId: string = '';
phoneNumber: string = '';
agentType: any = 'all';
activeTab: string = 'home';
proxyData: any;
masterdata: any
quickagentdata: any
masterentry: any;
parenlist: any;
allData: any[] = [];
filteredData: any[] = [];
updatedata: any[] = [];
respData: any = [];
@ViewChild('tab') tab!: ElementRef;



hierarchyarray = [
  { type: 3, name: 'Admin', alt: 'Admin' },
  { type: 4, name: 'Sub Admin', alt: 'Sub-admin' },
  { type: 5, name: 'Super', alt: 'Super' },
  { type: 6, name: 'Master', alt: 'Master' },
];
hierarchyarraylcagent = [
  { type: 2, name: 'Admin', alt: 'Admin' },
  { type: 3, name: 'Senior Sub Admin', alt: 'Senior Sub Admin' },
  { type: 4, name: 'Sub Admin', alt: 'Sub-admin' },
  { type: 5, name: 'Super', alt: 'Super' },
  { type: 6, name: 'Master', alt: 'Master' },
];
banner=[
  {imge:1},
  {imge:2},
  {imge:3}



]
searchArray: any[];
isSearchActive: boolean;
Update: any;
range = 'en';
languageIcon = 'assets/img/India.webp';
param: string;
matchedRole: any

constructor(private main: MainService ,
  private locationStrategy: LocationStrategy,
  private router: Router,
  @Inject(DOCUMENT) private document: Document,
  private titleService: Title
) {


  const metaTag: HTMLMetaElement = document.querySelector('meta[name="description"]');
  const metaKey: HTMLMetaElement = document.querySelector('meta[name="keywords"]');
  
  // if (this.siteName === 'play25') {
  //   const metaDescription = `Discover the official ${this.siteName} Agent List, your gateway to becoming part of the #1 trusted online betting exchange in Bangladesh and India. Join the most secure and rewarding platform with exclusive opportunities for agents.`;
  //   metaTag.setAttribute('content', metaDescription);
  
  //   const metaKeyWords = `Plabon, Play25, PlayAgentlist, Play25Agentlist, Agentlist, Plabon Owner, Trusted Agentlist, Play25 Betting, Online Betting Exchange, Bangladesh Betting Exchange, India Betting Exchange, Secure Agentlist, PlayAgent, Play25 Trusted Platform, Agent Opportunities, Top Betting Agents, Play25 Online Platform, Play25 Exchange, Secure PlayAgent List, Plabon Betting Exchange, PlayAgent Opportunities, Reliable Agentlist, Betting Agent Network`;
  //   metaKey.setAttribute('content', metaKeyWords);
  
  //   this.titleService.setTitle(`${this.siteName} Agent List - Trusted Agents for Betting Exchange in Bangladesh & India`);
  // } else {
  //   const metaDescription = `Discover the official ${this.siteName} Agent List, your gateway to becoming part of the #1 trusted online betting exchange in Bangladesh and India. Join the most secure and rewarding platform with exclusive opportunities for agents.`;
  //   metaTag.setAttribute('content', metaDescription);
  
  //   const metaKeyWords = `${this.siteName} Agent List, Trusted ${this.siteName} Agents, Secure ${this.siteName} Platform, ${this.siteName} Betting Exchange, Online Betting with ${this.siteName}, Bangladesh ${this.siteName} Exchange, India ${this.siteName} Exchange, Secure Platform, Trusted Opportunities`;
  //   metaKey.setAttribute('content', metaKeyWords);
  
  //   this.titleService.setTitle(`${this.siteName} Agent List - Trusted Agents for Betting Exchange in Bangladesh & India`);
  // }
  
  
  

  let bodytag = document.getElementsByTagName("BODY")[0];
  bodytag.classList.add(this.siteName);
  let favicon = this.document.querySelector('#appIcon') as HTMLLinkElement;
  favicon.href = "assets/img/favicon/" + this.siteName + ".ico";
  this.loadStyle('assets/theme/' + this.siteName + '.css?v=89852024');
  this.main.getWLID().subscribe((resp: any) => {
    if (resp.errorCode == 0) {
      let WLID = resp.result
      this.WLID = WLID[0].WLID
      this.getList()
      this.getSupportList()
      this.getproxy()
      this.getAllData()
      if(this.siteName == 'vellkielist'){
        this.getmaster();
      }
      else{
        this.getquicketagentdata()
      }
      this.UpdateBanner()
    }
  })


}
loadStyle(styleName: string) {
  const head = this.document.getElementsByTagName('head')[0];

  let themeLink = this.document.getElementById(
    'client-theme'
  ) as HTMLLinkElement;
  if (themeLink) {
    themeLink.href = styleName;
  } else {
    const style = this.document.createElement('link');
    style.id = 'client-theme';
    style.rel = 'stylesheet';
    style.href = `${styleName}`;

    head.appendChild(style);
  }
}

ngOnInit() {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const param = this.router.url;
      if (this.siteName == 'lcagentlist') {
        this.matchedRole = this.hierarchyarraylcagent.find(role => param.includes(`/#/${role.alt}`));
      }
      else {
        this.matchedRole = this.hierarchyarray.find(role => param.includes(`/#/${role.alt}`));
      }
      if (this.matchedRole) {
        this.getType(this.matchedRole);
      } else {
        this.router.navigate(['/']);
      }
    }
  });

  // this.getlanguages();
  this.getsocial()

}
getType(data) {  
  console.log("lmslmdldldsdlsm");
  
  if (data) {
    this.activeTab = data.name.toLowerCase();
    this.type = data.type;
    this.Name = data.name;
    this.titleService.setTitle(`${this.Name} | ${this.siteName} Agent List - Trusted Agents for Betting Exchange in Bangladesh & India`);
    if (this.WLID) {
      this.getList();
    }

    if (this.type) {
      if (this.siteName == 'lcagentlist') {
        switch (this.type) {
          case 2:
            this.param = 'Admin';
            break;
          case 3:
            this.param = 'Senior-Sub-Admin';
            break;
          case 4:
            this.param = 'Sub-admin';
            break;
          case 5:
            this.param = 'Super';
            break;
          case 6:
            this.param = 'Master';
            break;
          default:
            this.param = '';
        }

      }
      else {
        switch (this.type) {
          case 3:
            this.param = 'Admin';
            break;
          case 4:
            this.param = 'Sub-admin';
            break;
          case 5:
            this.param = 'Super';
            break;
          case 6:
            this.param = 'Master';
            break;
          default:
            this.param = '';
        }
      }


      this.locationStrategy.pushState(null, '', `/#/${this.param}`, '');
    }
    this.agentType = this.type;
    this.onSearch();
  }
  this.showdata=false
  this.isSearchActive = false;
  this.opensidebarmenu = false
  // $('.offcanvas-backdrop').removeClass("show");


}

ngAfterViewInit() {
  // Ensure tab is properly assigned after view initialization
  console.log(this.tab);  // Debugging check
}

getList() {
  this.main.getTypeWiseData(this.WLID, this.type).subscribe((resp: any) => {
    if (resp) {
      this.listArray = resp.result
      this.listArray.sort((a, b) => {
        return a.AGID - b.AGID;
      });
    }
    else {
      this.listArray = [];
    }
  })
}

closeReport() {
  this.openreports = false
}
openView(data) {
  let ViewList = []
  ViewList.push(data);
  this.ViewList = ViewList
  this.getHierchy(this.ViewList[0].USERID)
  this.openViews = !this.openViews
}
closeView() {
  this.openViews = false
}
getSupportList() {
  this.main.getTypeWiseData(this.WLID, 0).subscribe((resp: any) => {
    if (resp) {
      this.supportList = resp.result
      this.supportList.sort((a, b) => {
        return a.AGID - b.AGID;
      });
    }
  })
}
getproxy() {
  this.main.getproxydata(this.WLID).subscribe((resp: any) => {
    if (resp) {
      this.proxyData = resp.result
    }
  })
}
getmaster() {
  this.main.getmasterdata(this.WLID).subscribe((resp: any) => {
    if (resp) {
      this.masterdata = resp.result
      this.masterentry = this.getRandomData(this.masterdata);
      console.log(this.masterentry,"kmskmdskmkdmskdm");
      
    }
  })
}
getquicketagentdata() {
  this.main.getquicketagent(this.WLID).subscribe((resp: any) => {
    if (resp) {
      this.quickagentdata = resp.result
      if (this.quickagentdata.length > 0) {
        this.masterentry = this.getRandomData(this.quickagentdata);
        console.log(this.masterentry,"kmskmdskmkdmskdm");

      }
      else {
        this.getmaster()
      }
    }
  })
}
getRandomData(dataArray: any[]) {
  const randomIndex = Math.floor(Math.random() * dataArray.length);
  return dataArray[randomIndex];
}
openReport(data) {
  let ReportList = []
  ReportList.push(data);
  this.ReportList = ReportList
  this.getHierchy(this.ReportList[0].USERID)
  this.openreports = !this.openreports
}
openmaster:boolean=false
openMasterReport(USERID) {
  // console.log("cjeckkkkkkkkkk");
  
  this.getHierchy(USERID)
  this.openmaster=true

}

closemaster(){
  this.openmaster=false
 
}
getHierchy(USERID) {
  this.main.getParent(USERID).subscribe((resp: any) => {
    console.log(resp,"mkmk");

    if (resp) {
      this.parenlist = resp?.data
    }
  })
}
openSidebar() {
  this.opensidebarmenu = !this.opensidebarmenu
}
createArray(starCount: number): any[] {
  return Array(starCount).fill(0);
}

selecttbs(tab: string) {
  this.activeTab = tab.toLowerCase();

  if (tab === 'home') {
    this.Name = 'Home';
    this.agentType = 'all';
    this.titleService.setTitle(`${this.siteName} Agent List - Trusted Agents for Betting Exchange in Bangladesh & India`);
    this.isSearchActive = false;
    console.log("ksskndskndskdnskdndknksndksndskdnskdn");

  } else {
    this.agentType = tab.toLowerCase();
    this.isSearchActive = true;
    console.log("ksskndskndskdnskdndknksndksndskdnskdn");

    console.log("ksskndskndskdnskdndknksndksndskdnskdn");
    
    this.onSearch();
  }

  this.locationStrategy.pushState(null, '', '', '');
}





getAllData() {
  this.main.getAllData(this.WLID).subscribe((resp: any) => {
    if (resp && resp.result) {
      this.allData = resp.result;
      this.filteredData = this.allData;
    }
  });
}
onSearch() {
  this.searchArray = this.allData.filter(agent => {
    const matchesType = this.agentType === 'all' || agent.TYPE == this.agentType;
    const matchesAgentId = !this.agentId || agent.AGID.toString() === this.agentId;
    const matchesPhoneNumber = !this.phoneNumber || agent.WHATSAPP === this.phoneNumber;
    return matchesType && matchesAgentId && matchesPhoneNumber;
  });
  console.log("abid",this.searchArray);
  
  this.isSearchActive = true
  this.serachtab =false
  // $("#SearchAgent [data-bs-dismiss=modal]").trigger("click");

}

// getlanguages() {
//   this.main.getlanguage(this.range).subscribe(data => {
//     if (data != null) {
//       this.Update = data[0]
//       if (typeof this.Update === 'object') {
//         for (const prop in this.Update) {
//           if (
//             this.Update.hasOwnProperty(prop) &&
//             typeof this.Update[prop] === 'string'
//           ) {
//             this.Update[prop] = this.Update[prop].replace(
//               /Play25/g,
//               this.siteName
//             );
//           }
//         }
//       }
//     }
//   })
// }

changeLanguage(lang) {
  this.range = lang
  if (lang === 'en') {
    this.languageIcon = 'assets/img/India.webp';
  } else if (lang === 'bd') {
    this.languageIcon = 'assets/img/Bangladesh.webp';
  }
  // this.getlanguages();
}

UpdateBanner() {
  this.main.getupdate().subscribe((resp: any) => {
    if (resp) {
      this.updatedata = resp.result;
    }
  });
}

slideConfig = {
  draggable: true,
  autoplay: true,
  autoplaySpeed: 4000,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: false,
  arrows: false,
  fade: true 

};
addSlide() {
  // this.slides.push({ img: 'http://placehold.it/350x150/777777' });
}
removeSlide() {
  // this.slides.length = this.slides.length - 1;
}
slickInit(e: any) {
  // //console.log('slick initialized');
}
breakpoint(e: any) {
  // //console.log('breakpoint');
}
afterChange(e: any) {
  // //console.log('afterChange');
}
beforeChange(e: any) {
  // //console.log('beforeChange');
}
getsocial(){    
this.main.socialLink()?.subscribe((resp: any) => {
    if(resp){
      this.respData = resp?.result[0];
    }
  });
}





togglefun(){
this.showdata =! this.showdata
}
showsearch(){
  this.serachtab =! this.serachtab

}
gamepolicy:boolean=false
privacy:boolean=false
termsser:boolean=false
gamblingpo(){
  this.gamepolicy =! this.gamepolicy
}
privacypo(){
  this.privacy =! this.privacy
 
}
terms(){
  this.termsser =! this.termsser

}

public scrollRight(): void {
  if (this.tab) {
    this.tab.nativeElement.scrollTo({ 
      left: this.tab.nativeElement.scrollLeft + 50, 
      behavior: 'smooth' 
    });
  } else {
    console.error("Tab reference is undefined");
  }
}

public scrollleft(): void {
  if (this.tab) {
    this.tab.nativeElement.scrollTo({ 
      left: this.tab.nativeElement.scrollLeft - 50, 
      behavior: 'smooth' 
    });
  } else {
    console.error("Tab reference is undefined");
  }
}

}
