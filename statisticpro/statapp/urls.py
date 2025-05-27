from django.urls import path 
from statapp.views import  UploadBusinessExcel,BusinessStatistics, QueryCompanies , GenerateChart, StartScript, StopScript
from .views import CompanyListCreateView, CompanyDetailView


urlpatterns=[
    path('upload/',UploadBusinessExcel.as_view(),name='upload_business_excel'),
    path('query-companies/', QueryCompanies.as_view(),name='query_companies'),
    path('business/stats/', BusinessStatistics.as_view(), name='business_stats'),
    path('generate-chart/<str:chart_type>/', GenerateChart.as_view(), name='generate_chart'),
    path('start-script/', StartScript.as_view(), name='start_script'),
    path('stop-script/', StopScript.as_view(), name='stop_script'),
    path('companies/', CompanyListCreateView.as_view(), name='company-list-create'),
    path('companies/<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),

]