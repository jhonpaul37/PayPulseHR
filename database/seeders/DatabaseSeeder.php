<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\voucher;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        //Salary Grade
        DB::table('salary_grades')->insert([
            // Grade 1
            ['grade' => 1, 'step' => 1, 'monthly_salary' => 13000.00],
            ['grade' => 1, 'step' => 2, 'monthly_salary' => 13109.00],
            ['grade' => 1, 'step' => 3, 'monthly_salary' => 13219.00],
            ['grade' => 1, 'step' => 4, 'monthly_salary' => 13329.00],
            ['grade' => 1, 'step' => 5, 'monthly_salary' => 13441.00],
            ['grade' => 1, 'step' => 6, 'monthly_salary' => 13553.00],
            ['grade' => 1, 'step' => 7, 'monthly_salary' => 13666.00],
            ['grade' => 1, 'step' => 8, 'monthly_salary' => 13780.00],

            // Grade 2
            ['grade' => 2, 'step' => 1, 'monthly_salary' => 14100.00],
            ['grade' => 2, 'step' => 2, 'monthly_salary' => 14217.00],
            ['grade' => 2, 'step' => 3, 'monthly_salary' => 14335.00],
            ['grade' => 2, 'step' => 4, 'monthly_salary' => 14454.00],
            ['grade' => 2, 'step' => 5, 'monthly_salary' => 14574.00],
            ['grade' => 2, 'step' => 6, 'monthly_salary' => 14695.00],
            ['grade' => 2, 'step' => 7, 'monthly_salary' => 14817.00],
            ['grade' => 2, 'step' => 8, 'monthly_salary' => 14940.00],

            // Grade 3
            ['grade' => 3, 'step' => 1, 'monthly_salary' => 15700.00],
            ['grade' => 3, 'step' => 2, 'monthly_salary' => 15826.00],
            ['grade' => 3, 'step' => 3, 'monthly_salary' => 15953.00],
            ['grade' => 3, 'step' => 4, 'monthly_salary' => 16081.00],
            ['grade' => 3, 'step' => 5, 'monthly_salary' => 16210.00],
            ['grade' => 3, 'step' => 6, 'monthly_salary' => 16340.00],
            ['grade' => 3, 'step' => 7, 'monthly_salary' => 16471.00],
            ['grade' => 3, 'step' => 8, 'monthly_salary' => 16603.00],

            // Grade 4
            ['grade' => 4, 'step' => 1, 'monthly_salary' => 16900.00],
            ['grade' => 4, 'step' => 2, 'monthly_salary' => 17039.00],
            ['grade' => 4, 'step' => 3, 'monthly_salary' => 17179.00],
            ['grade' => 4, 'step' => 4, 'monthly_salary' => 17320.00],
            ['grade' => 4, 'step' => 5, 'monthly_salary' => 17462.00],
            ['grade' => 4, 'step' => 6, 'monthly_salary' => 17605.00],
            ['grade' => 4, 'step' => 7, 'monthly_salary' => 17749.00],
            ['grade' => 4, 'step' => 8, 'monthly_salary' => 17894.00],

            // Grade 5
            ['grade' => 5, 'step' => 1, 'monthly_salary' => 18400.00],
            ['grade' => 5, 'step' => 2, 'monthly_salary' => 18552.00],
            ['grade' => 5, 'step' => 3, 'monthly_salary' => 18705.00],
            ['grade' => 5, 'step' => 4, 'monthly_salary' => 18859.00],
            ['grade' => 5, 'step' => 5, 'monthly_salary' => 19014.00],
            ['grade' => 5, 'step' => 6, 'monthly_salary' => 19170.00],
            ['grade' => 5, 'step' => 7, 'monthly_salary' => 19327.00],
            ['grade' => 5, 'step' => 8, 'monthly_salary' => 19485.00],
        ]);

        //Benefits
        DB::table('benefits')->insert([
            ['name' =>'PERA','description' => 'PERA'],
            ['name' =>'LWOP-PERA','description' => 'leave without pay'],
            ['name' =>'RATA','description' => 'RATA'],
            ['name' =>'SALARY DIFFERENTIAL','description' => 'SALARY DIFFERENTIAL'],
        ]);

        //Contribution
        DB::table('contributions')->insert([
            ['name' =>'TAX','description' => 'Income TAX'],
            ['name' =>'GSIS PREM','description' => 'GSIS PREM'],
            ['name' =>'HDMF PREM1','description' => 'HDMF PREM1'],
            ['name' =>'PHIC','description' => 'PhilHealth'],
        ]);

        //Fund Cluster
        DB::table('fund_cluster')->insert([
            ['cluster_code' =>'07','desc' => 'TF', 'amount'=> '0'],
            ['cluster_code' =>'01','desc' => 'Regular GAA', 'amount'=> '0'],
            ['cluster_code' =>'05','desc' => 'STF', 'amount'=> '0'],
            ['cluster_code' =>'06','desc' => 'IGP', 'amount'=> '0'],
        ]);

        //UACS
        DB::table('accounting_entry')->insert([
            ['UACS_code' => '10101010', 'Account_title' => 'Cash Collecting Officers'],
            ['UACS_code' => '10101020', 'Account_title' => 'Petty Cash'],
            ['UACS_code' => '10102020', 'Account_title' => 'Cash in Bank Local Currency Current Account'],
            ['UACS_code' => '10102030', 'Account_title' => 'Cash in Bank Local Currency Savings Account'],
            ['UACS_code' => '10104010', 'Account_title' => 'Cash Treasury Agency Deposit Regular'],
            ['UACS_code' => '10104040', 'Account_title' => 'Cash- Modified Disbursement System (MDS) Regular'],
            ['UACS_code' => '10104070', 'Account_title' => 'Cash- Tax Remittance Advice'],
            ['UACS_code' => '10105020', 'Account_title' => 'Time Deposits- Local Currency'],
            ['UACS_code' => '10301010', 'Account_title' => 'Accounts Receivable'],
            ['UACS_code' => '10301012', 'Account_title' => 'Allowance for Impairment- Accounts Receivable'],
            ['UACS_code' => '10301990', 'Account_title' => 'Loans Receivable- Others'],
            ['UACS_code' => '10301992', 'Account_title' => 'Allowance for Impairment- Loans Receivable- Others'],
            ['UACS_code' => '10303010', 'Account_title' => 'Due from National Government Agencies'],
            ['UACS_code' => '10304050', 'Account_title' => 'Due from Other Funds'],
            ['UACS_code' => '10305990', 'Account_title' => 'Other Receivables'],
            ['UACS_code' => '10399010', 'Account_title' => 'Receivables- Disallowances/Charges'],
            ['UACS_code' => '10399020', 'Account_title' => 'Due from Officers and Employees'],
            ['UACS_code' => '10401010', 'Account_title' => 'Merchandise Inventory'],
            ['UACS_code' => '10404010', 'Account_title' => 'Office Supplies Inventory'],
            ['UACS_code' => '10404090', 'Account_title' => 'Agricultural and Marine Supplies Inventory'],
            ['UACS_code' => '10404100', 'Account_title' => 'Textbooks & Instructional Materials Inventory'],
            ['UACS_code' => '10404990', 'Account_title' => 'Other Supplies & Materials Inventory'],
            ['UACS_code' => '10405010', 'Account_title' => 'Semi-Expendable Machinery'],
            ['UACS_code' => '10405020', 'Account_title' => 'Semi-Expendable Office Equipment'],
            ['UACS_code' => '10405030', 'Account_title' => 'Semi-Expendable ICT Equipment'],
            ['UACS_code' => '10405040', 'Account_title' => 'Semi-Expendable Agricultural & Forestry Equipment'],
            ['UACS_code' => '10405110', 'Account_title' => 'Semi-Expendable Printing Equipment'],
            ['UACS_code' => '10405120', 'Account_title' => 'Semi-Expendable Sports Equipment'],
            ['UACS_code' => '10405130', 'Account_title' => 'Semi-Expendable Technical & Scientific Equipment'],
            ['UACS_code' => '10405160', 'Account_title' => 'Semi-Expendable Kitchen Equipment'],
            ['UACS_code' => '10405170', 'Account_title' => 'Semi-Expendable Electrical Equipment'],
            ['UACS_code' => '10405990', 'Account_title' => 'Semi-Expendable Other Equipment'],
            ['UACS_code' => '10406010', 'Account_title' => 'Semi-Expendable Furniture & Fixtures'],
            ['UACS_code' => '10406020', 'Account_title' => 'Semi-Expendable Books'],
            ['UACS_code' => '10601010', 'Account_title' => 'Land'],
            ['UACS_code' => '10602990', 'Account_title' => 'Other Land Improvements'],
            ['UACS_code' => '10602991', 'Account_title' => 'Accumulated Depreciation- Other Land Improvements'],
            ['UACS_code' => '10603050', 'Account_title' => 'Power Supply Systems'],
            ['UACS_code' => '10603051', 'Account_title' => 'Accumulated Depreciation- Power Supply Systems'],
            ['UACS_code' => '10604010', 'Account_title' => 'Buildings'],
            ['UACS_code' => '10604011', 'Account_title' => 'Accumulated Depreciation- Buildings'],
            ['UACS_code' => '10604020', 'Account_title' => 'School Buildings'],
            ['UACS_code' => '10604021', 'Account_title' => 'Accumulated Depreciation- School Buildings'],
            ['UACS_code' => '10604060', 'Account_title' => 'Hostels and Dormitories'],
            ['UACS_code' => '10604061', 'Account_title' => 'Accumulated Depreciation- Hostels and Dormitories'],
            ['UACS_code' => '10604990', 'Account_title' => 'Other Structures'],
            ['UACS_code' => '10604991', 'Account_title' => 'Accumulated Depreciation- Other Structures'],
            ['UACS_code' => '10605010', 'Account_title' => 'Machinery'],
            ['UACS_code' => '10605011', 'Account_title' => 'Accumulated Depreciation- Machinery'],
            ['UACS_code' => '10605020', 'Account_title' => 'Office Equipment'],
            ['UACS_code' => '10605021', 'Account_title' => 'Accumulated Depreciation- Office Equipment'],
            ['UACS_code' => '10605030', 'Account_title' => 'Information & Communication Technology Equipment'],
            ['UACS_code' => '10605031', 'Account_title' => 'Accumulated Depreciation- ICT Equipment'],
            ['UACS_code' => '10605040', 'Account_title' => 'Agricultural & Forestry Equipment'],
            ['UACS_code' => '10605041', 'Account_title' => 'Accumulated Depreciation- Agricultural & Forestry Equipment'],
            ['UACS_code' => '10605050', 'Account_title' => 'Marine and Fishery Equipment'],
            ['UACS_code' => '10605051', 'Account_title' => 'Accumulated Depreciation-Marine and Fishery Equipment'],
            ['UACS_code' => '10605070', 'Account_title' => 'Communication Equipment'],
            ['UACS_code' => '10605071', 'Account_title' => 'Accumulated Depreciation- Communication Equipment'],
            ['UACS_code' => '10605090', 'Account_title' => 'Disaster Response and Rescue Equipment'],
            ['UACS_code' => '10605091', 'Account_title' => 'Accumulated Depreciation- Disaster Response and Rescue Equipment'],
            ['UACS_code' => '10605100', 'Account_title' => 'Military;Police and Security Equipment'],
            ['UACS_code' => '10605101', 'Account_title' => 'Accumulated Depreciation- Military; Police and Security Equipment'],
            ['UACS_code' => '10605110', 'Account_title' => 'Medical Equipment'],
            ['UACS_code' => '10605111', 'Account_title' => 'Accumulated Depreciation- Medical Equipment'],
            ['UACS_code' => '10605130', 'Account_title' => 'Sports Equipment'],
            ['UACS_code' => '10605131', 'Account_title' => 'Accumulated Depreciation- Sports Equipment'],
            ['UACS_code' => '10605140', 'Account_title' => 'Technical & Scientific Equipment'],
            ['UACS_code' => '10605141', 'Account_title' => 'Accumulated Depreciation- Technical & Scientific Equipment'],
            ['UACS_code' => '10605160', 'Account_title' => 'Kitchen Equipment'],
            ['UACS_code' => '10605170', 'Account_title' => 'Electrical Equipment'],
            ['UACS_code' => '10605990', 'Account_title' => 'Other Equipment'],
            ['UACS_code' => '10605991', 'Account_title' => 'Accumulated Depreciation- Other Equipment'],
            ['UACS_code' => '10606010', 'Account_title' => 'Motor Vehicles'],
            ['UACS_code' => '10606011', 'Account_title' => 'Accumulated Depreciation- Motor Vehicles'],
            ['UACS_code' => '10607010', 'Account_title' => 'Furniture and Fixtures'],
            ['UACS_code' => '10607011', 'Account_title' => 'Accumulated Depreciation- Furniture and Fixtures'],
            ['UACS_code' => '10608010', 'Account_title' => 'Books'],
            ['UACS_code' => '10608011', 'Account_title' => 'Accumulated Depreciation- Books'],
        ]);
    }
}
