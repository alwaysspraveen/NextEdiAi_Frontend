import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { MessageService } from 'primeng/api';

// PrimeNG standalone imports (or use your ImportsModule if it already re-exports these)
import { ImportsModule } from '../../imports/imports';
import { BackendServices } from '../../api/backend';
import { FileUploadEvent } from 'primeng/fileupload';
import { User } from '../../core/interface/user.interface';
import { single } from 'rxjs';

type Opt = { label: string; value: string };

@Component({
  selector: 'app-add-student',
  standalone: true,
  templateUrl: './add-student.html',
  styleUrls: ['./add-student.css'],
  imports: [ImportsModule, ReactiveFormsModule, FormsModule],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AddStudent {
  @Input()
  get student(): User | null {
    return this._student;
  }
  @Input() isEditMode: boolean = false;
  private _student: User | null = null;

  set student(value: User | null) {
    this._student = value; // ✅ Save it in a backing field

    if (!this.isEditMode) {
      this.loadAddress();
    }

    if (value && this.form) {
      this.form.patchValue({
        ...value,
        class: value?.class?._id || value?.class || '',
        dob: value.dob ? new Date(value.dob) : null,
        enrollmentDate: value.enrollmentDate
          ? new Date(value.enrollmentDate)
          : new Date(),
        guardianCountry: value.guardianCountry || '',
        guardianState: value.guardianState || '',
        guardianCity: value.guardianCity || '',
      });

      if (value.guardianCountry) {
        this.api.getStates({ country: value.guardianCountry }).subscribe({
          next: (res: any) => {
            this.stateOptions =
              res.data?.states?.map((s: any) => ({
                label: s.name,
                value: s.name,
              })) || [];

            // 🔄 Load cities if guardianState is also present
            if (value.guardianState) {
              this.api
                .getCities(value.guardianCountry!, value.guardianState!)
                .subscribe({
                  next: (res: any) => {
                    this.cityOptions = res.data.map((city: any) => ({
                      label: city,
                      value: city,
                    }));
                  },
                  error: (err) => console.error('Error loading cities:', err),
                });
            }
          },
          error: (err) => console.error('Error loading states:', err),
        });
      }
    } else {
      this.form.reset({
        academicYear: '2025-2026',
        enrollmentDate: new Date(),
      });
    }
  }

  @Output() saved = new EventEmitter<void>(); // fire after save
  @Output() close = new EventEmitter<void>(); // fire on cancel
  countryOptions: { label: string; value: string }[] = [];
  stateOptions: { label: string; value: string }[] = [];
  cityOptions: { label: string; value: string }[] = [];

  onUpload($event: FileUploadEvent) {
    throw new Error('Method not implemented.');
  }
  onBasicUploadAuto($event: FileUploadEvent) {
    throw new Error('Method not implemented.');
  }
  loading = false;

  ngOnInit() {
    this.loadClasses();
    this.loadAddress();

    if (!this.isEditMode) {
      this.form
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  // Dropdown options
  classOptions = [
    { label: 'Nursery', value: 'Nursery' },
    { label: 'LKG', value: 'LKG' },
    { label: 'UKG', value: 'UKG' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
  ];

  sectionOptions: Opt[] = ['A', 'B', 'C'].map((v) => ({ label: v, value: v }));
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  relationOptions = [
    { label: 'Father', value: 'Father' },
    { label: 'Mother', value: 'Mother' },
    { label: 'Guardian', value: 'Guardian' },
  ];

  religionOption = [
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Muslim', value: 'Muslim' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Sikh', value: 'Sikh' },
  ];
  categoryOption = [
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' },
  ];

  bloodOptions = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
  ];
  yearOptions: Opt[] = ['2024-2025', '2025-2026', '2026-2027'].map((v) => ({
    label: v,
    value: v,
  }));
  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private api: BackendServices,
    private message: MessageService
  ) {
    this.form = this.fb.group({
      // Basic
      fname: ['', [Validators.required, Validators.minLength(2)]],
      mname: [''],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: this.isEditMode
        ? ['']
        : ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],

      // Student specifics
      admissionNo: ['', Validators.required],
      rollNo: ['', Validators.required],

      // NOTE: use 'klass' instead of 'class' (class conflicts with HTML attr)
      class: ['', Validators.required],
      section: ['', Validators.required],
      academicYear: ['2025-2026', Validators.required],

      dob: [null as Date | null, Validators.required],
      gender: ['', Validators.required],
      bloodGroup: [''],

      singleParent: [false],
      guardianName: ['', Validators.required],
      guardianEmail: ['', [Validators.required, Validators.email]],
      guardianPhone: ['', Validators.required],
      guardianRelation: ['', Validators.required],
      guardianAddress: [''],
      guardianCity: [''],
      guardianState: [''],
      guardianZip: [''],
      guardianCountry: [''],

      enrollmentDate: [new Date(), Validators.required],

      // Personal
      idCardNo: ['', Validators.required],
      category: [''],
      religion: [''],
      emergencyContact: ['', Validators.required],

      // Optional
      profileImage: [''],
    });
  }

  get f() {
    return this.form.controls;
  }

  loadAddress() {
    // ✅ Fetch all countries
    this.api.getCountries().subscribe({
      next: (res: any) => {
        console.log('Countries:', res);
        this.countryOptions = res.data.map((country: any) => ({
          label: country.name,
          value: country.name, // or country.id depending on API response
        }));
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      },
    });

    const selectedCountry = this.form.get('guardianCountry')?.value;

    if (selectedCountry) {
      this.api.getStates({ country: selectedCountry }).subscribe({
        next: (res: any) => {
          if (res?.data?.states) {
            this.stateOptions = res.data.states.map((s: any) => ({
              label: s.name,
              value: s.name,
            }));

            console.log('States:', this.stateOptions);
          }
        },
        error: (err) => {
          console.error('Error fetching states:', err);
        },
      });
    }

    if (selectedCountry && this.form.get('guardianState')?.value) {
      const selectedState = this.form.get('guardianState')?.value;
      this.api.getCities(selectedCountry, selectedState).subscribe({
        next: (res: any) => {
          console.log('Cities:', res);
          this.cityOptions = res.data.map((city: any) => ({
            label: city,
            value: city, // or city.id based on API response
          }));
        },
        error: (err) => {
          console.error('Error fetching cities:', err);
        },
      });
    }
  }

  loadClasses() {
    this.api.getClassrooms().subscribe({
      next: (res: any) => {
        this.classOptions = res.map((cls: any) => ({
          label: cls.name,
          value: cls._id,
        }));
      },
      error: () =>
        this.message.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    // map dates to ISO; attach role
    const payload: any = {
      ...this.form.getRawValue(),
      role: 'STUDENT',
    };

    if (payload.dob instanceof Date) payload.dob = payload.dob.toISOString();
    if (payload.enrollmentDate instanceof Date)
      payload.enrollmentDate = payload.enrollmentDate.toISOString();

    if (!this.isEditMode && !this.student) {
      this.api.addStudent(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message.add({
            severity: 'success',
            summary: 'Student Added',
            detail: 'Student created successfully',
            life: 2500,
          });
          this.form.reset({
            academicYear: '2025-2026',
            enrollmentDate: new Date(),
          });
          this.saved.emit(); // notify parent to refresh list
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Failed to create student';
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: msg,
            life: 3000,
          });
        },
      });
    } else if (this.isEditMode && this.student) {
      const user = this._student;

      if (user && user._id) {
        console.log('Checking edit');

        this.api.updateUser(user._id, payload).subscribe({
          next: () => {
            console.log('Its updating');

            this.message.add({
              severity: 'success',
              summary: 'Student Updated',
              detail: 'Student updated successfully',
              life: 2500,
            });

            this.saved.emit(); // notify parent to refresh list
          },
          error: (err) => {
            this.loading = false;
            const msg = err?.error?.message || 'Failed to update student';
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: msg,
              life: 3000,
            });
          },
        });
      } else {
        this.loading = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Student ID is missing. Cannot update student.',
          life: 3000,
        });
      }
    }
  }
  reset() {
    this.form.reset({ academicYear: '2025-2026', enrollmentDate: new Date() });
  }
}
