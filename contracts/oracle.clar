;; Oracle Contract for External Data Verification

(define-data-var current-time uint u0)

(define-constant err-unauthorized (err u403))

(define-public (set-current-time (new-time uint))
  (begin
    (asserts! (is-eq tx-sender contract-caller) err-unauthorized)
    (ok (var-set current-time new-time))
  )
)

(define-read-only (get-current-time)
  (ok (var-get current-time))
)

(define-map verified-data
  { data-type: (string-ascii 20), data-id: (string-ascii 50) }
  { value: (string-utf8 500), timestamp: uint }
)

(define-public (verify-data (data-type (string-ascii 20)) (data-id (string-ascii 50)) (value (string-utf8 500)))
  (begin
    (asserts! (is-eq tx-sender contract-caller) err-unauthorized)
    (ok (map-set verified-data
      { data-type: data-type, data-id: data-id }
      { value: value, timestamp: (var-get current-time) }
    ))
  )
)

(define-read-only (get-verified-data (data-type (string-ascii 20)) (data-id (string-ascii 50)))
  (ok (unwrap! (map-get? verified-data { data-type: data-type, data-id: data-id }) (err u404)))
)

