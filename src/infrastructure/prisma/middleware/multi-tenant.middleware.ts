/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// tenant-write-validation.middleware.ts
export function tenantWriteValidationMiddleware() {
  return async (params: any, next: any) => {
    const tenantModels = [
      'JobPost',
      'JobApplication',
      'Interview',
      'Comment',
      'CompanyUser',
    ];

    if (!params.model || !tenantModels.includes(params.model)) {
      return next(params);
    }

    const writeActions = [
      'create',
      'createMany',
      'update',
      'updateMany',
      'upsert',
      'deleteMany',
    ];

    // Only validate write operations
    if (!writeActions.includes(params.action)) {
      return next(params);
    }

    const data = params.args?.data;
    const where = params.args?.where;

    const ensure = (condition: boolean, msg: string) => {
      if (!condition) throw new Error(`MultiTenant Error: ${msg}`);
    };

    // --- CREATE MANY ---
    if (params.action === 'createMany') {
      ensure(Array.isArray(data), `createMany requires data[]`);
      data.forEach((d, i) =>
        ensure(
          'companyId' in d,
          `${params.model}.createMany missing companyId at index ${i}`,
        ),
      );
      return next(params);
    }

    // --- CREATE ---
    if (params.action === 'create') {
      ensure(data, `${params.model}.create missing data`);
      ensure('companyId' in data, `${params.model}.create missing companyId`);
      return next(params);
    }

    // --- UPSERT ---
    if (params.action === 'upsert') {
      ensure(data, `${params.model}.upsert missing data`);

      ensure(
        data.create && 'companyId' in data.create,
        `${params.model}.upsert.create missing companyId`,
      );

      // update often shouldn't change tenant, but require filtering
      ensure(
        where && 'companyId' in where,
        `${params.model}.upsert.update must filter by companyId`,
      );

      return next(params);
    }

    // --- UPDATE / UPDATE MANY ---
    if (params.action === 'update' || params.action === 'updateMany') {
      ensure(data, `${params.model}.${params.action} missing data`);

      const hasCompanyInData = 'companyId' in data;
      const hasCompanyInWhere = where && 'companyId' in where;

      ensure(
        hasCompanyInData || hasCompanyInWhere,
        `${params.model}.${params.action} must include companyId in data or where`,
      );

      return next(params);
    }

    // --- DELETE MANY ---
    if (params.action === 'deleteMany') {
      ensure(
        where && 'companyId' in where,
        `${params.model}.deleteMany must be tenant-scoped`,
      );

      return next(params);
    }

    return next(params);
  };
}
