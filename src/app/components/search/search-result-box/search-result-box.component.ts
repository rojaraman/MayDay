import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/services/app-store/app-store.service';
import { ApiCallService } from 'src/app/services/api-call/api-call.service';

@Component({
  selector: 'app-search-result-box',
  templateUrl: './search-result-box.component.html',
  styleUrls: ['./search-result-box.component.css']
})
export class SearchResultBoxComponent implements OnInit {

  doctors = [];
  drugs = [];
  doctorSearchParams: any = {
    name: '',
    location: '',
    user_location: '',
    skip: 0,
    limit: 0,
  };
  inProgress = false;
  paramsFromSearchToolBox: any;
  currentPageNumber: number = 1;
  pages: number[] = [];
  pageCount: number;
  metaData = { 'count': 0, limit: 0, total: 0 };
  constructor(
    public searchStore: AppStoreService,
    private apiCall: ApiCallService
  ) { }

  ngOnInit() {
    const storedSearchParams = this.searchStore.getSearchParams().subscribe((params)=>{
      this.doctorSearchParams.name = params ?  params.name || '' : '';
      this.doctorSearchParams.skip = params ? params.skip || 5 : 5;
      this.doctorSearchParams.limit = params ? params.limit || 5 : 5;
      if(params.resetPagination) {
        this.currentPageNumber = 1;
      }
    });
    this.searchStore.getData().subscribe((data) => {
      this.doctors = data['data'];
      this.metaData = data['meta'];
      this.doPagination();
    });

  }

  doPagination() {
    let pageCountRange = [1, this.metaData.limit];
    this.pages = [];
    this.pageCount = Math.trunc(this.metaData.total / this.metaData.limit) + (this.metaData.total % this.metaData.limit !== 0 ? 1 : 0);
    if (this.currentPageNumber >=  this.metaData.limit && (this.currentPageNumber + Math.trunc(this.metaData.limit/2)) <  this.pageCount) {
      pageCountRange = [this.currentPageNumber - Math.trunc(this.metaData.limit/2), Number(this.currentPageNumber) + Math.trunc(this.metaData.limit/2) + this.metaData.limit % 2];
    } else if (this.currentPageNumber + Math.trunc(this.metaData.limit/2) >= this.pageCount) {
      pageCountRange = [this.pageCount - this.metaData.limit ,this.pageCount];
    }     
    for (let i = pageCountRange[0]; i <= pageCountRange[1]; i++) {
      this.pages.push(i);
    }
  }

  pageClick(pageNumber: number) {
    if(Number(pageNumber) < 1 || Number(pageNumber)-1 > this.pageCount) {
      return;
    }
    this.searchStore.inProgress = true;
    this.currentPageNumber = Number(pageNumber);
    this.doctorSearchParams['skip'] = (pageNumber-1) * this.doctorSearchParams.limit;
    this.apiCall.setPostParams(this.doctorSearchParams);
    this.searchStore.storeData(this.apiCall.doPost('doctors_and_drugs', '/alldoctors'));
  }

}
