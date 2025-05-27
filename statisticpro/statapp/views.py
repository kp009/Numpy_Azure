import random
import time
import threading
import io
import base64
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Business
from rest_framework.pagination import PageNumberPagination
from .serializers import BusinessSerializer
from django.db.models import Q

# Create your views here.
class UploadBusinessExcel(APIView):
    def post(self, request):
        excel_file=request.FILES['office']
        df=pd.read_excel(excel_file)

        for _, row in df.iterrows():
            Business.objects.create(
                name=row['name'],
                revenue=row['revenue'],
                profit=row['profit'],
                employees=row['employees'],
                country=row['country'],
            )

        return Response({"message:Business data Uploaded"})


class CustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50

class CompanyListCreateView(APIView):
    pagination_class = CustomPagination

    def get(self, request):
        search_query = request.GET.get('search', '')
        sort_by = request.GET.get('sort_by', 'name')  # Default sort by name
        order = request.GET.get('order', 'asc')

        companies = Business.objects.all()

        # Apply search filter
        if search_query:
            companies = companies.filter(
                Q(name__icontains=search_query) | 
                Q(country__icontains=search_query)
            )

        # Sorting
        if order == 'desc':
            sort_by = f"-{sort_by}"
        companies = companies.order_by(sort_by)

        # Apply pagination
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(companies, request)
        serializer = BusinessSerializer(result_page, many=True)
        
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = BusinessSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyDetailView(APIView):
    def put(self, request, pk):
        try:
            company = Business.objects.get(pk=pk)
        except Business.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BusinessSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            company = Business.objects.get(pk=pk)
            company.delete()
            return Response({"message": "Company deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Business.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)


script_running = False  # Global flag for script control

# Function to generate random company data
def generate_random_data():
    global script_running
    names = ["Company A", "Company B", "Company C", "Company D", "Company E",
             "Company F", "Company G", "Company H", "Company I", "Company J"]
    countries = ["USA", "Canada", "Germany", "India", "Australia", "UK", "France", "Brazil", "Japan", "China"]

    while script_running:
        data = []
        for i in range(10):  # Generate 10 random companies
            name = random.choice(names)
            revenue = round(random.uniform(10000, 100000), 2)
            profit = round(random.uniform(5000, 50000), 2)
            employees = random.randint(50, 1000)
            country = random.choice(countries)
            data.append((name, revenue, profit, employees, country))

            # Save the generated company data to the database
            company = Business.objects.create(
                name=name,
                revenue=revenue,
                profit=profit,
                employees=employees,
                country=country
            )
            data.append(company)
        
        print(data)  # Log to console (or save to DB)
        time.sleep(5)  # Wait before generating next batch

# API to start the script
class StartScript(APIView):
    def get(self, request):
        global script_running
        if not script_running:
            script_running = True
            thread = threading.Thread(target=generate_random_data)
            thread.start()
            return Response({"message": "Script started"}, status=status.HTTP_200_OK)
        return Response({"message": "Script already running"}, status=status.HTTP_400_BAD_REQUEST)

# API to stop the script
class StopScript(APIView):
    def get(self, request):
        global script_running
        script_running = False
        return Response({"message": "Script stopped"}, status=status.HTTP_200_OK)

# API for business statistics
class BusinessStatistics(APIView):
    def get(self, request):
        business_data = Business.objects.values_list('revenue', 'profit', 'employees')
        np_data = np.array(business_data)
        
        if np_data.size == 0:
            return Response({"error": "No data available"}, status=status.HTTP_404_NOT_FOUND)

        stats = {
            'mean': np.mean(np_data, axis=0).tolist(),
            'std_dev': np.std(np_data, axis=0).tolist(),
            'min': np.min(np_data, axis=0).tolist()
        }
        return Response(stats)

# API for querying companies dynamically
class QueryCompanies(APIView):
    parser_classes = (MultiPartParser, FormParser)

    from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
from rest_framework import status

class QueryCompanies(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        excel_file = request.FILES['office']
        df = pd.read_excel(excel_file)

        query_type = request.data.get('query_type')  # Determine the query from frontend

        if query_type == "USA":
            data = df[df['country'] == 'USA']
        elif query_type == "profit_gt_20000":
            data = df[df['profit'] > 20000]
        elif query_type == "revenue_gt_50000":
            data = df[df['revenue'] > 50000]
        elif query_type == "total_revenue":
            total_revenue = df['revenue'].sum()  # Sum of all revenue
            return Response({"total_revenue": total_revenue})  # Return total revenue
        elif query_type == "total_employees_usa":
            total_employees_usa = df[df['country'] == 'USA']['employees'].sum()  # Total employees in USA
            return Response({"total_employees_usa": total_employees_usa})  # Return total employees in USA
        else:
            return Response({"error": "Invalid query type"}, status=status.HTTP_400_BAD_REQUEST)

        # If a data query type (not total revenue or total employees)
        return Response({"data": data.to_dict(orient="records")})



# API for generating charts
class GenerateChart(APIView):
    def get(self, request, chart_type):
        companies = Business.objects.all()
        df = pd.DataFrame(list(companies.values()))

        plt.figure(figsize=(8, 5))
        
        if chart_type == "bar":
            plt.bar(df["name"], df["revenue"], color="blue")
        elif chart_type == "pie":
            plt.pie(df["revenue"], labels=df["name"], autopct="%1.1f%%")
        elif chart_type == "scatter":
            plt.scatter(df["employees"], df["profit"], color="red")
            plt.xlabel("Employees")
            plt.ylabel("Profit")
        else:
            return Response({"error": "Invalid chart type"}, status=status.HTTP_400_BAD_REQUEST)

        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode("utf-8")

        return Response({"chart": image_base64})
